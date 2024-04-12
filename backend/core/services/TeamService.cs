namespace core;

using core.Migrations;
using Interfaces;

public class TeamService : ITeamService
{
    private readonly IProfileRepository _profileRepository;
    private readonly ITeamRepository _teamRepository;
    private readonly IMeetingRoomService _meetingRoomService;
    private readonly IConversationService _conversationService;
    private readonly IProfileService _profileService;
    private readonly IMeetingOccasionService _meetingOccasionService;
    private readonly IUserRepository _userRepository;

    public TeamService(
        IProfileRepository profileRepository,
        ITeamRepository teamRepository,
        IMeetingRoomService meetingRoomService,
        IConversationService conversationService,
        IProfileService profileService,
        IMeetingOccasionService meetingOccasionService,
        IUserRepository userRepository
    )
    {
        _profileRepository = profileRepository;
        _teamRepository = teamRepository;
        _meetingRoomService = meetingRoomService;
        _conversationService = conversationService;
        _profileService = profileService;
        _meetingOccasionService = meetingOccasionService;
        _userRepository = userRepository;
    }

    public async Task<Team> CreateAsync(
        IncomingCreateTeamDTO incomingCreateTeamDTO,
        User loggedInUser
    )
    {
        Team team =
            new()
            {
                Id = Utils.GenerateRandomId(),
                Code = Utils.GenerateRandomId(6, "upper"),
                Name = incomingCreateTeamDTO.TeamName,
                TeamRole = incomingCreateTeamDTO.TeamRole,
                ImageUrl = incomingCreateTeamDTO.ImageUrl,
                CreatedAt = DateTime.UtcNow,
                IsOpenForJoining = true,
                AllCanCreateMeetings = true
            };

        Team createdTeam = await _teamRepository.CreateAsync(team);

        //mötesrum skapas också som hör till teamet
        await _meetingRoomService.CreateMeetingRoom(createdTeam);

        Profile createdProfile = await _profileService.CreateProfile(
            loggedInUser,
            true,
            incomingCreateTeamDTO.ProfileRole,
            createdTeam
        );

        Conversation createdConversation = await _conversationService.CreateTeamConversationAsync(
            createdProfile.Id,
            createdTeam.Id
        );

        if (createdTeam != null && createdProfile != null && createdConversation != null)
        {
            await _teamRepository.UpdateAsync(createdTeam);
            return createdTeam;
        }
        else
        {
            throw new Exception();
        }
    }

    public async Task<Team> GetByCodeAsync(string code)
    {
        Team foundTeam = await _teamRepository.GetByCodeAsync(code);
        if (foundTeam != null)
        {
            return foundTeam;
        }
        else
        {
            throw new Exception();
        }
    }

    public async Task<Team> UpdateTeam(Team team, User loggedInUser)
    {
        try
        {
            var foundTeam = await _teamRepository.GetByIdAsync(team.Id) ?? throw new Exception();
            if (!loggedInUser.Profiles.Any(profile => profile.TeamId == foundTeam.Id))
            {
                throw new Exception("Only members om team can update.");
            }
            foundTeam.TeamRole = team.TeamRole;
            foundTeam.ImageUrl = team.ImageUrl;
            foundTeam.IsOpenForJoining = team.IsOpenForJoining;
            foundTeam.AllCanCreateMeetings = team.AllCanCreateMeetings;
            var updatedTeam = await _teamRepository.UpdateAsync(foundTeam);
            return updatedTeam;
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task<object> JoinTeam(JoinRequestDTO joinRequestDTO, User loggedInUser)
    {
        var teamToJoin = await _teamRepository.GetByCodeAsync(joinRequestDTO.Code);
        if (teamToJoin.IsOpenForJoining)
        {
            var createdProfile = await _profileService.CreateProfile(
                loggedInUser,
                false,
                joinRequestDTO.Role,
                teamToJoin
            );

            await _conversationService.AddParticipantToTeamConversation(
                createdProfile,
                teamToJoin.Id
            );
            await _meetingOccasionService.AddOccasionsToNewProfiles(
                createdProfile.Id,
                teamToJoin.Id
            );
            return createdProfile;
        }
        else
        {
            var request = new TeamRequest(
                Utils.GenerateRandomId(),
                loggedInUser.Id,
                teamToJoin.Id,
                teamToJoin.Name,
                false,
                false,
                joinRequestDTO.Role,
                loggedInUser.FirstName + " " + loggedInUser.LastName
            );
            var createdRequest = await _teamRepository.CreateRequest(request);
            return createdRequest;
        }
    }

    public async Task<List<Team>> GetTeamsByUserId(string userId)
    {
        try
        {
            return await _teamRepository.GetByUserIdAsync(userId);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<List<TeamRequest>> GetTeamRequestsByUserId(string userId)
    {
        try
        {
            return await _teamRepository.GetRequestsByUserIdAsync(userId);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<bool> CanDeleteTeam(string ownerId, string teamId)
    {
        var owner = await _profileRepository.GetByIdAsync(ownerId);

        if (owner == null)
        {
            return false;
        }

        var team = await _teamRepository.GetByIdAsync(teamId);

        if (team == null)
        {
            return false;
        }

        return owner.Team.Id == teamId;
    }

    public async Task DeleteRequest(string requestId, User loggedInUser)
    {
        try
        {
            var request = await _teamRepository.GetRequestByIdAsync(requestId);
            if (loggedInUser.Id != request.UserId)
            {
                throw new Exception();
            }
            await _teamRepository.DeleteRequest(request.Id);
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
            return await _teamRepository.GetUnconfirmedRequestByTeamIdAsync(teamId);
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
            var updatedRequest = await _teamRepository.UpdateTeamRequestAsync(request);
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
