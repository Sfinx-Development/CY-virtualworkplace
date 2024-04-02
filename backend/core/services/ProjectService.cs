using Interfaces;

namespace core;

public class ProjectService : IProjectService
{
    private readonly IProfileRepository _profileRepository;
    private readonly IProjectRepository _projectRepository;

    public ProjectService(
        IProfileRepository profileRepository,
        IProjectRepository projectRepository
    )
    {
        _profileRepository = profileRepository;
        _projectRepository = projectRepository;
    }

    public async Task<OutgoingProjectDTO> CreateProjectAsync(
        ProjectDTO projectDTO,
        User loggedInUser
    )
    {
        try
        {
            var profile =
                await _profileRepository.GetByUserAndTeamIdAsync(loggedInUser.Id, projectDTO.TeamId)
                ?? throw new Exception("Can't find profile");

            Project newProject =
                new(
                    Utils.GenerateRandomId(),
                    projectDTO.Title,
                    projectDTO.Description,
                    DateTime.UtcNow,
                    projectDTO.EndDate,
                    projectDTO.TeamId
                );

            Project createdProject = await _projectRepository.CreateAsync(newProject);
            var createdDTO = new OutgoingProjectDTO(
                createdProject.Id,
                createdProject.Title,
                createdProject.Description,
                createdProject.DateCreated,
                createdProject.EndDate,
                createdProject.TeamId
            );

            return createdDTO;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<OutgoingProjectDTO> UpdateProject(ProjectDTO projectDTO, User loggedInUser)
    {
        try
        {
            var project =
                await _projectRepository.GetByIdAsync(projectDTO.Id) ?? throw new Exception();
            var profile = await _profileRepository.GetByUserAndTeamIdAsync(
                loggedInUser.Id,
                projectDTO.TeamId
            );

            // if (!profile.IsOwner)
            // {
            //     throw new Exception("Only owner of team can update healthcheck");
            // }

            project.Title = projectDTO.Title ?? project.Title;
            project.Description = projectDTO.Description ?? project.Description;
            project.EndDate = projectDTO.EndDate;

            var updatedProject = await _projectRepository.UpdateAsync(project);
            var updatedDTO = new OutgoingProjectDTO(
                updatedProject.Id,
                updatedProject.Title,
                updatedProject.Description,
                updatedProject.DateCreated,
                updatedProject.EndDate,
                updatedProject.TeamId
            );
            return updatedDTO;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<OutgoingProjectDTO> GetProjectBykId(string id)
    {
        try
        {
            var project = await _projectRepository.GetByIdAsync(id);

            if (project == null)
            {
                throw new Exception("project can't be found");
            }
            else
            {
                var projectDTO = new OutgoingProjectDTO(
                    project.Id,
                    project.Title,
                    project.Description,
                    project.DateCreated,
                    project.EndDate,
                    project.TeamId
                );

                return projectDTO;
            }
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task<List<OutgoingProjectDTO>> GetByTeam(string teamId, User loggedInUser)
    {
        try
        {
            var profile = await _profileRepository.GetByUserAndTeamIdAsync(loggedInUser.Id, teamId);
            if (profile.UserId != loggedInUser.Id)
            {
                throw new Exception("Not valid user");
            }

            var projects = await _projectRepository.GetAllByTeam(profile.TeamId);
            // var healthChecksValidNow = healthChecks.FindAll(
            //     h => h.StartTime >= now && h.EndTime < now
            // );
            var projectDTOs = new List<OutgoingProjectDTO>();

            projectDTOs = projects
                .Select(
                    p =>
                        new OutgoingProjectDTO(
                            p.Id,
                            p.Title,
                            p.Description,
                            p.DateCreated,
                            p.EndDate,
                            p.TeamId
                        )
                )
                .OrderBy(p => p.DateCreated)
                .ToList();

            return projectDTOs;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task DeleteById(string id, User loggedInUser)
    {
        try
        {
            //när denna raderas så ska alla profilers svar också raderas
            var project = await _projectRepository.GetByIdAsync(id);
            var profile = await _profileRepository.GetByUserAndTeamIdAsync(
                loggedInUser.Id,
                project.TeamId
            );
            // if (project.)
            // {
            //     throw new Exception("Only team owner can delete project.");
            // }
            await _projectRepository.DeleteByIdAsync(id);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}
