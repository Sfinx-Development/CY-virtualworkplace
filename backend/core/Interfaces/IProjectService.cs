using System;
using Interfaces;

namespace core;

public interface IProjectService
{
    Task<ProjectDTO> CreateProjectAsync(ProjectDTO healthCheck, User loggedInUser);

    Task<ProjectDTO> UpdateProject(ProjectDTO healthCheck, User loggedInUser);

    Task<ProjectDTO> GetProjectBykId(string id);
    Task<List<ProjectDTO>> GetByTeam(string teamId, User loggedInUser);
    Task DeleteById(string id, User loggedInUser);
}
