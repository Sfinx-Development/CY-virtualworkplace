namespace core;

using Interfaces;

public class TeamRequestService : ITeamRequestService
{
    private readonly IConversationService _conversationService;
    private readonly IProfileService _profileService;
    private readonly IMeetingOccasionService _meetingOccasionService;
    private readonly IUserRepository _userRepository;
    private readonly ITeamRequestRepository _requestRepository;
    private readonly ITeamRepository _teamRepository;

    public TeamRequestService(
        IConversationService conversationService,
        IProfileService profileService,
        IMeetingOccasionService meetingOccasionService,
        IUserRepository userRepository,
        ITeamRequestRepository requestRepository,
        ITeamRepository teamRepository
    )
    {
        _conversationService = conversationService;
        _profileService = profileService;
        _meetingOccasionService = meetingOccasionService;
        _userRepository = userRepository;
        _requestRepository = requestRepository;
        _teamRepository = teamRepository;
    }

    public async Task<List<TeamRequest>> GetTeamRequestsByUserId(string userId)
    {
        try
        {
            return await _requestRepository.GetRequestsByUserIdAsync(userId);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<TeamRequest> GetById(string id)
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
            if (loggedInUser.Id != request.UserId)
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

    public async Task<List<TeamRequest>> GetUnconfirmedTeamRequestsByTeamId(
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

    public async Task<TeamRequest> UpdateTeamRequest(TeamRequest request, User loggedInUser)
    {
        try
        {
            //om owner?
            var updatedRequest = await _requestRepository.UpdateTeamRequestAsync(request);
            if (updatedRequest.CanJoin && updatedRequest.IsConfirmed)
            {
                var team = await _teamRepository.GetByIdAsync(request.TeamId);
                var user = await _userRepository.GetByIdAsync(request.UserId);
                var createdProfile = await _profileService.CreateProfile(
                    user,
                    false,
                    updatedRequest.Role,
                    team
                );

                await _conversationService.AddParticipantToTeamConversation(
                    createdProfile,
                    team.Id
                );
                await _meetingOccasionService.AddOccasionsToNewProfiles(createdProfile.Id, team.Id);
            }
            return updatedRequest;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}
