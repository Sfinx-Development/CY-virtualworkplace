namespace core;

public interface IFileService
{
    Task<ProjectFileDTO> CreateAsync(ProjectFileDTO fileDTO);

    Task<ProjectFileDTO> UpdateAsync(ProjectFileDTO fileDTO, User loggedInUser);

    Task<ProjectFileDTO> GetById(string id, User loggedInUser);
    Task<List<ProjectFileDTO>> GetByUpdateComment(string updateCommentId, User loggedInUser);
    Task DeleteById(string id, User loggedInUser);
}
