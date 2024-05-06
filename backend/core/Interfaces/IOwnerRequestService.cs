using core;

namespace Interfaces;

public interface IOwnerRequestService
{
    Task<OwnerRequest> UpdateOwnerRequest(OwnerRequest request, User loggedInUser);
    Task<List<OwnerRequest>> GetOwnerRequestsByProfileId(string profileId);
    Task<OwnerRequest> GetById(string id);
    Task<List<OwnerRequest>> GetUnconfirmedOwnerRequestsByTeamId(string teamId, User loggedInUser);
    Task DeleteRequest(string requestId, User loggedInUser);
}
