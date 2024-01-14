namespace core;

using Interfaces;

public class TeamService : ITeamService
{
    private readonly IProfileRepository _profileRepository;
    private readonly ITeamRepository _teamRepository;

    private readonly IMeetingRoomService _meetingRoomService;
    private static readonly Random random = new Random();
    private static readonly Random anotherrandom = new Random();

    public TeamService(
        IProfileRepository profileRepository,
        ITeamRepository teamRepository,
        IMeetingRoomService meetingRoomService
    )

    {
        _profileRepository = profileRepository;
        _teamRepository = teamRepository;
        _meetingRoomService = meetingRoomService;
    }

    public async Task<Team> CreateAsync(IncomingCreateTeamDTO incomingCreateTeamDTO)
    {
        Team team =
            new()
            {
                Id = Utils.GenerateRandomId(),
                Code = Utils.GenerateRandomId(),
                Name = incomingCreateTeamDTO.TeamName,
                TeamRole = incomingCreateTeamDTO.TeamRole,
                CreatedAt = DateTime.UtcNow
            };

        Team createdTeam = await _teamRepository.CreateAsync(team);

        //mötesrum skapas också som hör till teamet
        await _meetingRoomService.CreateMeetingRoom(createdTeam);

        if (createdTeam != null)
        {
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

    public async Task<Team> UpdateTeam(Team team)
    {
        try
        {
            var foundTeam = await _teamRepository.GetByIdAsync(team.Id) ?? throw new Exception();
            foundTeam.TeamRole = team.TeamRole;
            var updatedTeam = await _teamRepository.UpdateAsync(foundTeam);
            return updatedTeam;
        }
        catch (Exception)
        {
            throw new Exception();
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
}
