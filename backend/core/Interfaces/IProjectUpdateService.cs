namespace core;

public interface IProjectUpdateService
{
    Task<OutgoingUpdateDTO> CreateAsync(ProjectUpdateDTO projectUpdateDTO, User loggedInUser);

    Task DeleteByIdAsync(string id, User loggedInUser);

    Task<IEnumerable<OutgoingUpdateDTO>> GetAllByProject(string projectId, User loggedInUser);

    Task<OutgoingUpdateDTO> GetByIdAsync(string id);

    Task<OutgoingUpdateDTO> UpdateAsync(ProjectUpdateDTO projectUpdateDTO, User loggedInUser);
}
