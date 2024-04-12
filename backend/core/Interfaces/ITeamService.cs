using core;

namespace Interfaces;

public interface ITeamService
{
    Task<Team> CreateAsync(IncomingCreateTeamDTO incomingCreateTeamDTO, User loggedInUser);
    Task<Team> GetByCodeAsync(string code);
    Task<Team> UpdateTeam(Team team, User loggedInUser);
    Task<bool> CanDeleteTeam(string ownerId, string teamId);
    Task<List<Team>> GetTeamsByUserId(string userId);
    Task<List<TeamRequest>> GetTeamRequestsByUserId(string userId);
    Task<object> JoinTeam(JoinRequestDTO joinRequestDTO, User loggedInUser);
    Task DeleteRequest(string requestId, User loggedInUser);
}
