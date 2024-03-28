namespace core;

public interface IUpdateCommentRepository
{
    Task<UpdateComment> CreateAsync(UpdateComment updateComment);

    Task DeleteByIdAsync(string id, User loggedInUser);

    Task<IEnumerable<UpdateCommentDTO>> GetAllByProjectUpdate(
        string projectUpdateId,
        User loggedInUser
    );

    Task<UpdateCommentDTO> GetByIdAsync(string id);

    Task<UpdateCommentDTO> UpdateAsync(UpdateCommentDTO updateCommentDTO, User loggedInUser);
}
