using Microsoft.EntityFrameworkCore;

namespace core;

public class UpdateCommentRepository : IUpdateCommentRepository
{
    private readonly CyDbContext _cyDbContext;

    public UpdateCommentRepository(CyDbContext cyDbContext)
    {
        _cyDbContext = cyDbContext;
    }

    public async Task<UpdateComment> CreateAsync(UpdateComment updateComment)
    {
        try
        {
            await _cyDbContext.UpdateComments.AddAsync(updateComment);
            await _cyDbContext.SaveChangesAsync();
            return updateComment;
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
            var foundUpdateComment = await _cyDbContext.UpdateComments.FindAsync(id);
            if (foundUpdateComment != null)
            {
                var projectUpdate = await _cyDbContext.ProjectUpdates.FindAsync(
                    foundUpdateComment.ProjectUpdateId
                );
                var allComments = await _cyDbContext
                    .UpdateComments.Where(c => c.ProjectUpdateId == projectUpdate.Id)
                    .ToListAsync();
                if (allComments.Count() == 1)
                {
                    _cyDbContext.ProjectUpdates.Remove(projectUpdate);
                    _cyDbContext.UpdateComments.Remove(foundUpdateComment);
                    await _cyDbContext.SaveChangesAsync();
                }
                else
                {
                    _cyDbContext.UpdateComments.Remove(foundUpdateComment);
                    await _cyDbContext.SaveChangesAsync();
                }
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<IEnumerable<UpdateComment>> GetAllByProjectUpdate(string projectUpdateId)
    {
        try
        {
            var updateComments = await _cyDbContext
                .UpdateComments.Where(u => u.ProjectUpdate.Id == projectUpdateId)
                .Include(p => p.Profile)
                .ToListAsync();
            return updateComments;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<UpdateComment> GetByIdAsync(string id)
    {
        try
        {
            var updateComment = await _cyDbContext
                .UpdateComments.Include(u => u.ProjectUpdate)
                .ThenInclude(p => p.Project)
                .Include(u => u.Profile)
                .Where(p => p.Id == id)
                .FirstOrDefaultAsync();
            return updateComment;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<UpdateComment> UpdateAsync(UpdateComment updateComment)
    {
        try
        {
            _cyDbContext.UpdateComments.Update(updateComment);
            await _cyDbContext.SaveChangesAsync();
            return updateComment;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}
