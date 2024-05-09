using Interfaces;
using Microsoft.EntityFrameworkCore;

namespace core;

public class OwnerRequestRepository : IOwnerRequestRepository
{
    private readonly CyDbContext _cyDbContext;

    public OwnerRequestRepository(CyDbContext cyDbContext)
    {
        _cyDbContext = cyDbContext;
    }

    public async Task<List<OwnerRequest>> GetRequestsByProfileIdAsync(string profileId)
    {
        try
        {
            var ownerRequests = await _cyDbContext
                .OwnerRequests.Where(t => t.ProfileId == profileId)
                .ToListAsync();
            return ownerRequests ?? new List<OwnerRequest>();
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<OwnerRequest> CreateRequest(OwnerRequest request)
    {
        try
        {
            await _cyDbContext.OwnerRequests.AddAsync(request);
            await _cyDbContext.SaveChangesAsync();
            return request;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task DeleteRequest(string id)
    {
        try
        {
            var requestToDelete = await _cyDbContext.OwnerRequests.FindAsync(id);
            if (requestToDelete != null)
            {
                _cyDbContext.OwnerRequests.Remove(requestToDelete);
                await _cyDbContext.SaveChangesAsync();
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<OwnerRequest> GetRequestByIdAsync(string requestId)
    {
        try
        {
            OwnerRequest request = await _cyDbContext.OwnerRequests.FirstAsync(
                t => t.Id == requestId
            );
            if (request != null)
            {
                return request;
            }
            else
            {
                throw new Exception("No request found.");
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<List<OwnerRequest>> GetUnconfirmedRequestByTeamIdAsync(string teamId)
    {
        try
        {
            var unconfirmedRequests =
                await _cyDbContext
                    .OwnerRequests.Where(t => t.Profile.TeamId == teamId && t.IsConfirmed == false)
                    .ToListAsync() ?? new List<OwnerRequest>();

            return unconfirmedRequests;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<OwnerRequest> UpdateOwnerRequestAsync(OwnerRequest request)
    {
        try
        {
            var requestToUpdate =
                await _cyDbContext.OwnerRequests.FirstAsync(t => t.Id == request.Id)
                ?? throw new Exception();
            requestToUpdate.IsConfirmed = request.IsConfirmed;
            requestToUpdate.IsOwner = request.IsOwner;
            _cyDbContext.OwnerRequests.Update(requestToUpdate);

            await _cyDbContext.SaveChangesAsync();
            return requestToUpdate;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<OwnerRequest> CreateRequestAsync(OwnerRequest ownerRequest)
    {
        try
        {
            await _cyDbContext.OwnerRequests.AddAsync(ownerRequest);
            await _cyDbContext.SaveChangesAsync();
            return ownerRequest;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}
