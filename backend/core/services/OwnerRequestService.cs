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

    public async Task<List<OwnerRequest>> GetOwnerRequestsByProfileId(string profileId)
    {
        try
        {
            return await _requestRepository.GetRequestsByProfileIdAsync(profileId);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<OwnerRequest> GetById(string id)
    {
        try
        {
            return await _requestRepository.GetRequestByIdAsync(id);
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

    public async Task<List<OwnerRequest>> GetUnconfirmedOwnerRequestsByTeamId(
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
            return await _requestRepository.GetUnconfirmedRequestByTeamIdAsync(teamId);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<OwnerRequest> UpdateOwnerRequest(OwnerRequest request, User loggedInUser)
    {
        try
        {
            var profile = await _profileRepository.GetByIdAsync(request.ProfileId);
            var loggedInProfile = await _profileService.GetProfileByAuthAndTeam(
                loggedInUser,
                profile.TeamId
            );
            var updatedRequest = await _requestRepository.UpdateOwnerRequestAsync(request);
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
            return updatedRequest;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}
