// using Interfaces;
// using Microsoft.EntityFrameworkCore;

// namespace core;

// public class CyRepository
// {
//     private readonly CyDbContext _cyDbContext;

//     public CyRepository(CyDbContext cyDbContext)
//     {
//         _cyDbContext = cyDbContext;
//     }

//     public async Task<Cy> GetById(string id)
//     {
//         try
//         {
//             Cy cy = await _cyDbContext.Cys.Where(m => m.Id == id).FirstAsync();

//             if (cy == null)
//             {
//                 throw new Exception();
//             }
//             else
//             {
//                 return cy;
//             }
//         }
//         catch (Exception e)
//         {
//             throw new Exception();
//         }
//     }

//     public async Task<Cy> CreateAsync(Cy cy)
//     {
//         try
//         {
//             await _cyDbContext.Cys.AddAsync(cy);
//             await _cyDbContext.SaveChangesAsync();

//             return cy;
//         }
//         catch (Exception e)
//         {
//             throw new Exception();
//         }
//     }

//     public async Task<Cy> UpdateAsync(Cy cy)
//     {
//         try
//         {
//             var cyToUpdate = await _cyDbContext.Cys.FirstAsync(c => c.Id == cy.Id);

//             if (cyToUpdate == null)
//             {
//                 throw new Exception();
//             }

//             cyToUpdate.HealthCheckInterval = cy.HealthCheckInterval;

//             _cyDbContext.Cys.Update(cyToUpdate);

//             await _cyDbContext.SaveChangesAsync();
//             return cyToUpdate;
//         }
//         catch (Exception e)
//         {
//             throw new Exception();
//         }
//     }

//     public async Task DeleteByIdAsync(string id)
//     {
//         try
//         {
//             var cyToDelete = await _cyDbContext.Cys.FindAsync(id);

//             if (cyToDelete != null)
//             {
//                 _cyDbContext.Cys.Remove(cyToDelete);
//                 await _cyDbContext.SaveChangesAsync();
//             }
//         }
//         catch (Exception e)
//         {
//             throw new Exception(e.Message);
//         }
//     }
// }
