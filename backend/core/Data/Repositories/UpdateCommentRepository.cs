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

    public Task DeleteByIdAsync(string id, User loggedInUser)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<UpdateCommentDTO>> GetAllByProjectUpdate(
        string projectUpdateId,
        User loggedInUser
    )
    {
        throw new NotImplementedException();
    }

    public Task<UpdateCommentDTO> GetByIdAsync(string id)
    {
        throw new NotImplementedException();
    }

    public Task<UpdateCommentDTO> UpdateAsync(UpdateCommentDTO updateCommentDTO, User loggedInUser)
    {
        throw new NotImplementedException();
    }
}
