using core;

namespace Interfaces;

public interface IOwnerRequestService
{
    Task<OwnerRequestDTO> UpdateOwnerRequest(OwnerRequestDTO request, User loggedInUser);
    Task<OwnerRequestDTO> CreateAsync(OwnerRequestDTO request, User loggedInUser);
    Task<List<OwnerRequestDTO>> GetOwnerRequestsByProfileId(string profileId);
    Task<OwnerRequestDTO> GetById(string id);
    Task<List<OwnerRequestDTO>> GetUnconfirmedOwnerRequestsByTeamId(
        string teamId,
        User loggedInUser
    );
    Task DeleteRequest(string requestId, User loggedInUser);
}
