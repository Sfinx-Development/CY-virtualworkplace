namespace core;

public interface IUpdateCommentRepository
{
    Task<UpdateComment> CreateAsync(UpdateComment updateComment);

    Task DeleteByIdAsync(string id);

    Task<IEnumerable<UpdateComment>> GetAllByProjectUpdate(string projectUpdateId);

    Task<UpdateComment> GetByIdAsync(string id);

    Task<UpdateComment> UpdateAsync(UpdateComment updateComment);
}
