using Interfaces;
using Microsoft.EntityFrameworkCore;

namespace core;

public class TeamRequestRepository : ITeamRequestRepository
{
    private readonly CyDbContext _cyDbContext;

    public TeamRequestRepository(CyDbContext cyDbContext)
    {
        _cyDbContext = cyDbContext;
    }

    public async Task<List<TeamRequest>> GetRequestsByUserIdAsync(string userId)
    {
        try
        {
            var teamRequests = await _cyDbContext
                .TeamRequests.Where(t => t.UserId == userId)
                .ToListAsync();
            return teamRequests ?? new List<TeamRequest>();
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<TeamRequest> CreateRequest(TeamRequest request)
    {
        try
        {
            await _cyDbContext.TeamRequests.AddAsync(request);
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
            var requestToDelete = await _cyDbContext.TeamRequests.FindAsync(id);
            if (requestToDelete != null)
            {
                _cyDbContext.TeamRequests.Remove(requestToDelete);
                await _cyDbContext.SaveChangesAsync();
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<TeamRequest> GetRequestByIdAsync(string requestId)
    {
        try
        {
            TeamRequest request = await _cyDbContext.TeamRequests.FirstAsync(
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

    public async Task<List<TeamRequest>> GetUnconfirmedRequestByTeamIdAsync(string teamId)
    {
        try
        {
            var unconfirmedRequests =
                await _cyDbContext
                    .TeamRequests.Where(t => t.TeamId == teamId && t.IsConfirmed == false)
                    .ToListAsync() ?? new List<TeamRequest>();

            return unconfirmedRequests;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<TeamRequest> UpdateTeamRequestAsync(TeamRequest request)
    {
        try
        {
            var requestToUpdate =
                await _cyDbContext.TeamRequests.FirstAsync(t => t.Id == request.Id)
                ?? throw new Exception();
            requestToUpdate.IsConfirmed = request.IsConfirmed;
            requestToUpdate.CanJoin = request.CanJoin;
            _cyDbContext.TeamRequests.Update(requestToUpdate);

            await _cyDbContext.SaveChangesAsync();
            return requestToUpdate;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}
