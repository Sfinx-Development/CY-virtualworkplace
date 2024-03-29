namespace core;

public interface IProjectRepository
{
    Task<Project> CreateAsync(Project project);

    Task<Project> GetByIdAsync(string id);

    Task<Project> UpdateAsync(Project project);

    Task DeleteByIdAsync(string id);

    Task<List<Project>> GetAllByTeam(string teamId);
}
