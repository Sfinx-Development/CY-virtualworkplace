namespace core;

public interface IFileRepository
{
    Task<ProjectFile> CreateAsync(ProjectFile projectFile);

    Task<ProjectFile> GetByIdAsync(string id);

    Task<ProjectFile> UpdateAsync(ProjectFile file);

    Task DeleteByIdAsync(string id);

    Task<List<ProjectFile>> GetAllByUpdateComment(string updateCommentId);
}
