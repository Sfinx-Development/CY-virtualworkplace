namespace core;

public class TeamService
{
    private readonly ProfileRepository _profileRepository;
    private readonly TeamRepository _teamRepository;
    private static readonly Random random = new Random();

    public TeamService(ProfileRepository profileRepository, TeamRepository teamRepository)
    {
        _profileRepository = profileRepository;
        _teamRepository = teamRepository;
    }

    public async Task<Team> CreateAsync(IncomingCreateTeamDTO incomingCreateTeamDTO)
    {
        Team team =
            new()
            {
                Id = GenerateRandomCode(),
                Code = GenerateRandomCode(),
                Name = incomingCreateTeamDTO.TeamName,
                TeamRole = incomingCreateTeamDTO.TeamRole,
                CreatedAt = DateTime.UtcNow
            };

        Team createdTeam = await _teamRepository.CreateAsync(team);
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

    public static string GenerateRandomCode(int length = 8)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        char[] idArray = new char[length];

        for (int i = 0; i < length; i++)
        {
            idArray[i] = chars[random.Next(chars.Length)];
        }

        return new string(idArray);
    }
}
