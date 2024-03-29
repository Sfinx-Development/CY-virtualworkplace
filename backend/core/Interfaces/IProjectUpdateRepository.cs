namespace core;

public interface IProjectUpdateRepository
{
    Task<ProjectUpdate> CreateAsync(ProjectUpdate projectUpdate);

    Task DeleteByIdAsync(string id);

    Task<IEnumerable<ProjectUpdate>> GetAllByProject(string projectId);

    Task<ProjectUpdate> GetByIdAsync(string id);

    Task<ProjectUpdate> UpdateAsync(ProjectUpdate projectUpdate);
    Task<int> GetLatestVersion(string projectId);
}
