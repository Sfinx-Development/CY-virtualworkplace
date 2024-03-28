namespace core;

public interface IProjectUpdateRepository
{
    Task<ProjectUpdate> CreateAsync(ProjectUpdate projectUpdate);

    Task DeleteByIdAsync(string id);

    Task<IEnumerable<ProjectUpdate>> GetAllByProject(string projectId);

    Task<ProjectUpdate> GetByIdAsync(string id);

    Task<ProfileHealthCheck> UpdateAsync(ProfileHealthCheck healthCheck);
}
