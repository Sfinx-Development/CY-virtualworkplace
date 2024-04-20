using core;

namespace Interfaces
{
    public interface ITeamRequestRepository
    {
        Task<List<TeamRequest>> GetRequestsByUserIdAsync(string userId);
        Task<TeamRequest> UpdateTeamRequestAsync(TeamRequest request);
        Task DeleteRequest(string id);
        Task<TeamRequest> GetRequestByIdAsync(string requestId);
        Task<List<TeamRequest>> GetUnconfirmedRequestByTeamIdAsync(string teamId);
        Task<TeamRequest> CreateRequest(TeamRequest teamRequest);
    }
}
