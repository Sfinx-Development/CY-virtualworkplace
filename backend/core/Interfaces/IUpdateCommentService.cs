using Interfaces;

namespace core;

public interface IUpdateCommentService
{
    Task<UpdateCommentDTO> CreateAsync(UpdateCommentDTO updateCommentDTO, User loggedInUser);

    Task DeleteByIdAsync(string id, User loggedInUser);
    Task<IEnumerable<UpdateCommentDTO>> GetAllByProjectUpdate(
        string projectUpdateId,
        User loggedInUser
    );

    Task<UpdateCommentDTO> GetByIdAsync(string id);

    Task<UpdateCommentDTO> UpdateAsync(UpdateCommentDTO updateCommentDTO, User loggedInUser);
}
