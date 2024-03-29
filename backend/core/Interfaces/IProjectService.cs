using System;
using Interfaces;

namespace core;

public interface IProjectService
{
    Task<OutgoingProjectDTO> CreateProjectAsync(ProjectDTO healthCheck, User loggedInUser);

    Task<OutgoingProjectDTO> UpdateProject(ProjectDTO healthCheck, User loggedInUser);

    Task<OutgoingProjectDTO> GetProjectBykId(string id);
    Task<List<OutgoingProjectDTO>> GetByTeam(string teamId, User loggedInUser);
    Task DeleteById(string id, User loggedInUser);
}
