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

    public async Task<ProjectDTO> CreateProjectAsync(ProjectDTO projectDTO, User loggedInUser)
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
                    // projectDTO.DateCreated.AddHours(1),
                    new DateTime(),
                    projectDTO.EndDate,
                    projectDTO.TeamId
                );

            Project createdProject = await _projectRepository.CreateAsync(newProject);
            var createdDTO = new ProjectDTO()
            {
                Id = createdProject.Id,
                Title = createdProject.Title,
                Description = createdProject.Description,
                DateCreated = createdProject.DateCreated,
                EndDate = createdProject.EndDate,
                TeamId = createdProject.TeamId
            };

            return createdDTO;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ProjectDTO> UpdateProject(ProjectDTO projectDTO, User loggedInUser)
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
            var updatedDTO = new ProjectDTO()
            {
                Id = updatedProject.Id,
                Title = updatedProject.Title,
                Description = updatedProject.Description,
                DateCreated = updatedProject.DateCreated,
                EndDate = updatedProject.EndDate,
                TeamId = updatedProject.TeamId
            };

            return updatedDTO;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ProjectDTO> GetProjectBykId(string id)
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
                var projectDTO = new ProjectDTO()
                {
                    Id = project.Id,
                    Title = project.Title,
                    Description = project.Description,
                    DateCreated = project.DateCreated,
                    EndDate = project.EndDate,
                    TeamId = project.TeamId
                };

                return projectDTO;
            }
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task<List<ProjectDTO>> GetByTeam(string profileId, User loggedInUser)
    {
        try
        {
            var profile = await _profileRepository.GetByIdAsync(profileId);
            if (profile.UserId != loggedInUser.Id)
            {
                throw new Exception("Not valid user");
            }

            var projects = await _projectRepository.GetAllByTeam(profile.TeamId);
            // var healthChecksValidNow = healthChecks.FindAll(
            //     h => h.StartTime >= now && h.EndTime < now
            // );
            var projectDTOs = new List<ProjectDTO>();

            projectDTOs = projects
                .Select(
                    p =>
                        new ProjectDTO()
                        {
                            Id = p.Id,
                            Title = p.Title,
                            Description = p.Description,
                            DateCreated = p.DateCreated,
                            EndDate = p.EndDate,
                            TeamId = p.TeamId
                        }
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
            if (!profile.IsOwner)
            {
                throw new Exception("Only team owner can delete project.");
            }
            //radera alla updates och comments sen med:
            // var profileHealthChecks = await _profileHealthCheckRepository.GetAllByHealthCheck(
            //     healthCheck.Id
            // );
            // foreach (var profileHC in profileHealthChecks)
            // {
            //     await _profileHealthCheckRepository.DeleteByIdAsync(profileHC.Id);
            // }
            await _projectRepository.DeleteByIdAsync(id);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}
