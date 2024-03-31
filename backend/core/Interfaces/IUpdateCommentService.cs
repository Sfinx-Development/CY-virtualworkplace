using Interfaces;

namespace core;

public interface IUpdateCommentService
{
    Task<OutgoingCommentDTO> CreateAsync(UpdateCommentDTO updateCommentDTO, User loggedInUser);

    Task DeleteByIdAsync(string id, User loggedInUser);
    Task<IEnumerable<OutgoingCommentDTO>> GetAllByProjectUpdate(
        string projectUpdateId,
        User loggedInUser
    );

    Task<OutgoingCommentDTO> GetByIdAsync(string id);

    Task<OutgoingCommentDTO> UpdateAsync(UpdateCommentDTO updateCommentDTO, User loggedInUser);
}
