using Interfaces;
using Microsoft.EntityFrameworkCore;

namespace core;

public class HealthCheckRepository : IHealthCheckRepository
{
    private readonly CyDbContext _cyDbContext;

    public HealthCheckRepository(CyDbContext cyDbContext)
    {
        _cyDbContext = cyDbContext;
    }

    public async Task<HealthCheck> CreateAsync(HealthCheck healthCheck)
    {
        try
        {
            await _cyDbContext.HealthChecks.AddAsync(healthCheck);
            await _cyDbContext.SaveChangesAsync();
            return healthCheck;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<HealthCheck> GetByIdAsync(string id)
    {
        try
        {
            HealthCheck healthCheck = await _cyDbContext
                .HealthChecks.Include(h => h.Team)
                .Where(m => m.Id == id)
                .FirstAsync();

            if (healthCheck != null)
            {
                return healthCheck;
            }
            else
            {
                throw new Exception("HealthCheck not found.");
            }
        }
        catch (Exception e)
        {
            throw new Exception();
        }
    }

    public async Task<HealthCheck> UpdateAsync(HealthCheck healthCheck)
    {
        try
        {
            _cyDbContext.HealthChecks.Update(healthCheck);

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
            var healthCheckToDelete = await _cyDbContext.HealthChecks.FindAsync(id);
            if (healthCheckToDelete != null)
            {
                var profileHealthChecks = await _cyDbContext
                    .ProfileHealthChecks.Where(p => p.HealthCheckId == healthCheckToDelete.Id)
                    .ToListAsync();
                if (profileHealthChecks != null)
                {
                    _cyDbContext.ProfileHealthChecks.RemoveRange(profileHealthChecks);
                }
                _cyDbContext.HealthChecks.Remove(healthCheckToDelete);
                await _cyDbContext.SaveChangesAsync();
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<List<HealthCheck>> GetAllByTeam(string teamId)
    {
        try
        {
            var HealthChecks = await _cyDbContext
                .HealthChecks.Where(m => m.TeamId == teamId)
                .ToListAsync();
            return HealthChecks;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}
