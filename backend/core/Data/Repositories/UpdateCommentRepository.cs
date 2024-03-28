using System.Linq.Expressions;
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
}
