using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace core;

public class ProfileHealthCheckRepository : IProfileHealthCheckRepository
{
    private readonly CyDbContext _cyDbContext;

    public ProfileHealthCheckRepository(CyDbContext cyDbContext)
    {
        _cyDbContext = cyDbContext;
    }

    public async Task<ProfileHealthCheck> CreateAsync(ProfileHealthCheck healthCheck)
    {
        try
        {
            await _cyDbContext.ProfileHealthChecks.AddAsync(healthCheck);
            await _cyDbContext.SaveChangesAsync();
            return healthCheck;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task DeleteByIdAsync(string id)
    {
        try
        {
            var foundProfileHealthCheck = await _cyDbContext.ProfileHealthChecks.FindAsync(id);
            if (foundProfileHealthCheck != null)
            {
                _cyDbContext.ProfileHealthChecks.Remove(foundProfileHealthCheck);
                await _cyDbContext.SaveChangesAsync();
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<IEnumerable<ProfileHealthCheck>> GetAllByHealthCheck(string healthCheckId)
    {
        try
        {
            var profileHealthChecks = await _cyDbContext
                .ProfileHealthChecks.Where(p => p.HealthCheckId == healthCheckId)
                .ToListAsync();
            return profileHealthChecks;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<IEnumerable<ProfileHealthCheck>> GetAllByProfileId(string profileId)
    {
        try
        {
            var profileHealthChecks = await _cyDbContext
                .ProfileHealthChecks.Where(p => p.ProfileId == profileId)
                .ToListAsync();
            return profileHealthChecks;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ProfileHealthCheck> GetByIdAsync(string id)
    {
        try
        {
            var profileHealthCheck = await _cyDbContext
                .ProfileHealthChecks.Where(p => p.Id == id)
                .FirstAsync();
            return profileHealthCheck;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ProfileHealthCheck> UpdateAsync(ProfileHealthCheck healthCheck)
    {
        try
        {
            _cyDbContext.ProfileHealthChecks.Update(healthCheck);
            await _cyDbContext.SaveChangesAsync();
            return healthCheck;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}
