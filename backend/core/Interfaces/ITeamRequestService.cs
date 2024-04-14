using core;

namespace Interfaces;

public interface ITeamRequestService
{
    Task<TeamRequest> UpdateTeamRequest(TeamRequest request, User loggedInUser);
    Task<List<TeamRequest>> GetTeamRequestsByUserId(string userId);
    Task<TeamRequest> GetById(string id);
    Task<List<TeamRequest>> GetUnconfirmedTeamRequestsByTeamId(string teamId, User loggedInUser);
    Task DeleteRequest(string requestId, User loggedInUser);
}
