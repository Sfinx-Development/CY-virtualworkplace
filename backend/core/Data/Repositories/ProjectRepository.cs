// using Interfaces;
// using Microsoft.EntityFrameworkCore;

// namespace core;

// public class ProjectRepository : IProjectRepository
// {
//     private readonly CyDbContext _cyDbContext;

//     public ProjectRepository(CyDbContext cyDbContext)
//     {
//         _cyDbContext = cyDbContext;
//     }

//     public async Task<Project> CreateAsync(Project project)
//     {
//         try
//         {
//             await _cyDbContext.HealthChecks.AddAsync(project);
//             await _cyDbContext.SaveChangesAsync();
//             return healthCheck;
//         }
//         catch (Exception e)
//         {
//             throw new Exception(e.Message);
//         }
//     }

//     public async Task<Project> GetByIdAsync(string id)
//     {
//         try
//         {
//             Project project = await _cyDbContext
//                 .HealthChecks.Include(h => h.Team)
//                 .Where(m => m.Id == id)
//                 .FirstAsync();

//             if (project != null)
//             {
//                 return project;
//             }
//             else
//             {
//                 throw new Exception("project not found.");
//             }
//         }
//         catch (Exception e)
//         {
//             throw new Exception();
//         }
//     }

//     public async Task<Project> UpdateAsync(Project project)
//     {
//         try
//         {
//             _cyDbContext.HealthChecks.Update(project);

//             await _cyDbContext.SaveChangesAsync();
//             return project;
//         }
//         catch (Exception e)
//         {
//             throw new Exception(e.Message);
//         }
//     }

//     public async Task DeleteByIdAsync(string id)
//     {
//         try
//         {
//             var healthCheckToDelete = await _cyDbContext.HealthChecks.FindAsync(id);
//             if (healthCheckToDelete != null)
//             {
//                 _cyDbContext.HealthChecks.Remove(healthCheckToDelete);
//                 await _cyDbContext.SaveChangesAsync();
//             }
//         }
//         catch (Exception e)
//         {
//             throw new Exception(e.Message);
//         }
//     }

//     public async Task<List<Project>> GetAllByTeam(string teamId)
//     {
//         try
//         {
//             var HealthChecks = await _cyDbContext
//                 .HealthChecks.Where(m => m.TeamId == teamId)
//                 .ToListAsync();
//             return HealthChecks;
//         }
//         catch (Exception e)
//         {
//             throw new Exception(e.Message);
//         }
//     }
// }
