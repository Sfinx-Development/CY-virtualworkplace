using core;

namespace Interfaces;

public interface ITeamService
{
    Task<Team> CreateAsync(IncomingCreateTeamDTO incomingCreateTeamDTO, User loggedInUser);
    Task<Team> GetByCodeAsync(string code);
    Task<Team> UpdateTeam(Team team);
    Task<bool> CanDeleteTeam(string ownerId, string teamId);
    Task<List<Team>> GetTeamsByUserId(string userId);
}
