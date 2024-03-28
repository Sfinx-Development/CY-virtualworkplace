namespace core;

public interface IProjectUpdateService
{
    Task<ProjectUpdateDTO> CreateAsync(ProjectUpdateDTO projectUpdateDTO, User loggedInUser);

    Task DeleteByIdAsync(string id, User loggedInUser);

    Task<IEnumerable<ProjectUpdateDTO>> GetAllByProject(string projectId, User loggedInUser);

    Task<ProjectUpdateDTO> GetByIdAsync(string id);

    Task<ProjectUpdateDTO> UpdateAsync(ProjectUpdateDTO projectUpdateDTO, User loggedInUser);
}
