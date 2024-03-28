using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace core;

public class ProjectUpdateRepository : IProjectUpdateRepository
{
    private readonly CyDbContext _cyDbContext;

    public ProjectUpdateRepository(CyDbContext cyDbContext)
    {
        _cyDbContext = cyDbContext;
    }

    public async Task<ProjectUpdate> CreateAsync(ProjectUpdate projectUpdate)
    {
        try
        {
            await _cyDbContext.ProjectUpdates.AddAsync(projectUpdate);
            await _cyDbContext.SaveChangesAsync();
            return projectUpdate;
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
            var projectUpdate = await _cyDbContext.ProjectUpdates.FindAsync(id);
            if (projectUpdate != null)
            {
                _cyDbContext.ProjectUpdates.Remove(projectUpdate);
                await _cyDbContext.SaveChangesAsync();
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<IEnumerable<ProjectUpdate>> GetAllByProject(string projectId)
    {
        try
        {
            var projectUpdates = await _cyDbContext
                .ProjectUpdates.Where(p => p.ProjectId == projectId)
                .ToListAsync();
            return projectUpdates;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ProjectUpdate> GetByIdAsync(string id)
    {
        try
        {
            var projectUpdate = await _cyDbContext
                .ProjectUpdates.Where(p => p.Id == id)
                .FirstAsync();
            return projectUpdate;
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
