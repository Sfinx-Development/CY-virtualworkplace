namespace core;

using Interfaces;

public class OwnerRequestService : IOwnerRequestService
{
    private readonly IConversationService _conversationService;
    private readonly IProfileService _profileService;
    private readonly IProfileRepository _profileRepository;
    private readonly IMeetingOccasionService _meetingOccasionService;
    private readonly IUserRepository _userRepository;
    private readonly IOwnerRequestRepository _requestRepository;
    private readonly ITeamRepository _teamRepository;

    public OwnerRequestService(
        IConversationService conversationService,
        IProfileService profileService,
        IProfileRepository profileRepository,
        IMeetingOccasionService meetingOccasionService,
        IUserRepository userRepository,
        IOwnerRequestRepository requestRepository,
        ITeamRepository teamRepository
    )
    {
        _conversationService = conversationService;
        _profileService = profileService;
        _profileRepository = profileRepository;
        _meetingOccasionService = meetingOccasionService;
        _userRepository = userRepository;
        _requestRepository = requestRepository;
        _teamRepository = teamRepository;
    }

    public async Task<List<OwnerRequestDTO>> GetOwnerRequestsByProfileId(string profileId)
    {
        try
        {
            var requests = await _requestRepository.GetRequestsByProfileIdAsync(profileId);
            return requests.Select(r => StaticMapper.MapToOwnerRequestDTO(r)).ToList();
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<OwnerRequestDTO> GetById(string id)
    {
        try
        {
            var request = await _requestRepository.GetRequestByIdAsync(id);
            return StaticMapper.MapToOwnerRequestDTO(request);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task DeleteRequest(string requestId, User loggedInUser)
    {
        try
        {
            var request = await _requestRepository.GetRequestByIdAsync(requestId);
            var profile = await _profileRepository.GetByUserIdAsync(loggedInUser.Id);
            if (loggedInUser.Profiles.Any(p => p.Id != request.ProfileId))
            {
                throw new Exception();
            }
            await _requestRepository.DeleteRequest(request.Id);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<List<OwnerRequestDTO>> GetUnconfirmedOwnerRequestsByTeamId(
        string teamId,
        User loggedInUser
    )
    {
        try
        {
            var team = await _teamRepository.GetByIdAsync(teamId);
            var profile = team.Profiles.Find(p => p.UserId == loggedInUser.Id);
            if (profile == null || !profile.IsOwner)
            {
                throw new Exception("Only team owners can get requests.");
            }
            var requests = await _requestRepository.GetUnconfirmedRequestByTeamIdAsync(teamId);
            return requests.Select(request => StaticMapper.MapToOwnerRequestDTO(request)).ToList();
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<OwnerRequestDTO> UpdateOwnerRequest(
        OwnerRequestDTO request,
        User loggedInUser
    )
    {
        try
        {
            var profile = await _profileRepository.GetByIdAsync(request.ProfileId);
            var loggedInProfile = await _profileService.GetProfileByAuthAndTeam(
                loggedInUser,
                profile.TeamId
            );
            var requestToUpdate = StaticMapper.MapToOwnerRequest(request, loggedInProfile);
            var updatedRequest = await _requestRepository.UpdateOwnerRequestAsync(requestToUpdate);
            var updatedRequestDTO = StaticMapper.MapToOwnerRequestDTO(updatedRequest);
            if (updatedRequest.IsOwner && updatedRequest.IsConfirmed)
            {
                profile.IsOwner = request.IsOwner;
                var profileUpdateDTO = new ProfileUpdateDTO
                {
                    Id = profile.Id,
                    IsOwner = profile.IsOwner
                };
                await _profileRepository.UpdateAsync(profileUpdateDTO);
            }
            return updatedRequestDTO;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<OwnerRequestDTO> CreateAsync(OwnerRequestDTO request, User loggedInUser)
    {
        try
        {
            var profile = await _profileRepository.GetByIdAsync(request.ProfileId);
            var loggedInProfile = await _profileService.GetProfileByAuthAndTeam(
                loggedInUser,
                profile.TeamId
            );
            if (!loggedInProfile.IsOwner)
            {
                throw new Exception("Only owners can invite members to be owners.");
            }
            var profileToAdd = await _profileRepository.GetByIdAsync(request.ProfileId);
            if (profileToAdd.IsOwner)
            {
                throw new Exception("Member is already an owner.");
            }
            var requestToAdd = StaticMapper.MapToOwnerRequest(request, profileToAdd);
            requestToAdd.Id = Utils.GenerateRandomId();
            var createdRequest = await _requestRepository.CreateRequestAsync(requestToAdd);
            var createdRequestDTO = StaticMapper.MapToOwnerRequestDTO(createdRequest);
            return createdRequestDTO;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}
