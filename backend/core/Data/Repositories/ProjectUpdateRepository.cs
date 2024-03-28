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
                .ProjectUpdates.Include(p => p.Project)
                .Where(p => p.Id == id)
                .FirstAsync();
            return projectUpdate;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<int> GetLatestVersion(string projectId)
    {
        try
        {
            var latestUpdate = await _cyDbContext
                .ProjectUpdates.Where(p => p.ProjectId == projectId)
                .OrderByDescending(p => p.Version)
                .FirstOrDefaultAsync();

            if (latestUpdate == null)
            {
                return 0;
            }
            else
            {
                return latestUpdate.Version;
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ProjectUpdate> UpdateAsync(ProjectUpdate projectUpdate)
    {
        try
        {
            _cyDbContext.ProjectUpdates.Update(projectUpdate);
            await _cyDbContext.SaveChangesAsync();
            return projectUpdate;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}
