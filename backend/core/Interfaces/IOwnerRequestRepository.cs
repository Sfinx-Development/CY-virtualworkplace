using core;

namespace Interfaces
{
    public interface IOwnerRequestRepository
    {
        Task<OwnerRequest> GetRequestByProfileIdAsync(string profileId);
        Task<OwnerRequest> UpdateOwnerRequestAsync(OwnerRequest request);
        Task DeleteRequest(string id);
        Task<OwnerRequest> GetRequestByIdAsync(string requestId);
        Task<List<OwnerRequest>> GetUnconfirmedRequestByTeamIdAsync(string teamId);
        Task<OwnerRequest> CreateRequestAsync(OwnerRequest ownerRequest);
    }
}
