namespace core;

public interface IUpdateCommentRepository
{
    Task<UpdateComment> CreateAsync(UpdateComment updateComment);

    // Task DeleteByIdAsync(string id, User loggedInUser);

    // Task<IEnumerable<ProjectUpdateDTO>> GetAllByProject(string projectId, User loggedInUser);

    // Task<ProjectUpdateDTO> GetByIdAsync(string id);

    // Task<UpdateCommentDTO> UpdateAsync(UpdateCommentDTO updateCommentDTO, User loggedInUser);
}
