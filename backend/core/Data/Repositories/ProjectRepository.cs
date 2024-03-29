using Microsoft.EntityFrameworkCore;

namespace core;

public class ProjectRepository : IProjectRepository
{
    private readonly CyDbContext _cyDbContext;

    public ProjectRepository(CyDbContext cyDbContext)
    {
        _cyDbContext = cyDbContext;
    }

    public async Task<Project> CreateAsync(Project project)
    {
        try
        {
            await _cyDbContext.Projects.AddAsync(project);
            await _cyDbContext.SaveChangesAsync();
            return project;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<Project> GetByIdAsync(string id)
    {
        try
        {
            Project project = await _cyDbContext
                .Projects.Include(h => h.Team)
                .Where(m => m.Id == id)
                .FirstAsync();

            if (project != null)
            {
                return project;
            }
            else
            {
                throw new Exception("project not found.");
            }
        }
        catch (Exception e)
        {
            throw new Exception();
        }
    }

    public async Task<Project> UpdateAsync(Project project)
    {
        try
        {
            _cyDbContext.Projects.Update(project);

            await _cyDbContext.SaveChangesAsync();
            return project;
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
            var projectToDelete = await _cyDbContext.Projects.FindAsync(id);
            if (projectToDelete != null)
            {
                _cyDbContext.Projects.Remove(projectToDelete);
                await _cyDbContext.SaveChangesAsync();
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<List<Project>> GetAllByTeam(string teamId)
    {
        try
        {
            var projects = await _cyDbContext.Projects.Where(m => m.TeamId == teamId).ToListAsync();
            return projects;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}
