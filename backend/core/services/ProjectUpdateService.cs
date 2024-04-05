using Interfaces;

namespace core;

public class ProjectUpdateService : IProjectUpdateService
{
    private readonly IProjectUpdateRepository _projectUpdateRepository;
    private readonly IProjectRepository _projectRepository;
    private readonly IProfileRepository _profileRepository;
    private readonly IUpdateCommentRepository _updateRepository;
    private readonly ITeamRepository _teamRepository;

    public ProjectUpdateService(
        IProjectUpdateRepository projectUpdateRepository,
        IProjectRepository projectRepository,
        IProfileRepository profileRepository,
        ITeamRepository teamRepository,
        IUpdateCommentRepository updateCommentRepository
    )
    {
        _projectUpdateRepository = projectUpdateRepository;
        _projectRepository = projectRepository;
        _profileRepository = profileRepository;
        _teamRepository = teamRepository;
        _updateRepository = updateCommentRepository;
    }

    public async Task<OutgoingUpdateDTO> CreateAsync(
        ProjectUpdateDTO projectUpdateDTO,
        User loggedInUser
    )
    {
        try
        {
            var project = await _projectRepository.GetByIdAsync(projectUpdateDTO.ProjectId);
            var profile = await _profileRepository.GetByUserAndTeamIdAsync(
                loggedInUser.Id,
                project.TeamId
            );
            if (profile.UserId != loggedInUser.Id)
            {
                throw new Exception("User does not belong to this profile.");
            }

            //versionen får sättas automatiskt .. en funktion typ nextversion
            var latestVersion = await _projectUpdateRepository.GetLatestVersion(project.Id);

            ProjectUpdate projectUpdate =
                new(
                    Utils.GenerateRandomId(),
                    projectUpdateDTO.Title,
                    projectUpdateDTO.ProjectId,
                    projectUpdateDTO.DateCreated,
                    latestVersion + 1
                );
            var createdProjectUpdate = await _projectUpdateRepository.CreateAsync(projectUpdate);
            return new OutgoingUpdateDTO(
                createdProjectUpdate.Id,
                createdProjectUpdate.Title,
                createdProjectUpdate.ProjectId,
                createdProjectUpdate.DateCreated,
                createdProjectUpdate.Version
            );
        }
        catch (Exception e)
        {
            throw new(e.Message);
        }
    }

    public async Task DeleteByIdAsync(string id, User loggedInUser)
    {
        try
        {
            var projectUpdate = await _projectUpdateRepository.GetByIdAsync(id);
            var profile = await _profileRepository.GetByUserAndTeamIdAsync(
                loggedInUser.Id,
                projectUpdate.Project.TeamId
            );
            if (profile.UserId != loggedInUser.Id)
            {
                throw new Exception("User does not belong to this profile.");
            }

            await _projectUpdateRepository.DeleteByIdAsync(id);
        }
        catch (Exception e)
        {
            throw new(e.Message);
        }
    }

    public async Task<IEnumerable<OutgoingUpdateDTO>> GetAllByProject(
        string projectId,
        User loggedInUser
    )
    {
        try
        {
            //sen för varje uppdatering så får vi ha en service och controller för hämta updatedomments
            var project = await _projectRepository.GetByIdAsync(projectId);
            var teams = await _teamRepository.GetByUserIdAsync(loggedInUser.Id);
            if (!teams.Any(t => t.Id == project.TeamId))
            {
                throw new Exception("You can only get results from your own team.");
            }
            var projectUpdates = await _projectUpdateRepository.GetAllByProject(project.Id);
            var projectUpdateDTOs = projectUpdates
                .Select(
                    h => new OutgoingUpdateDTO(h.Id, h.Title, h.ProjectId, h.DateCreated, h.Version)
                )
                .OrderByDescending(h => h.DateCreated)
                .ToList();
            return projectUpdateDTOs ?? new List<OutgoingUpdateDTO>();
        }
        catch (System.Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<OutgoingUpdateDTO> GetByIdAsync(string id)
    {
        try
        {
            //villkor?
            var projectUpdate = await _projectUpdateRepository.GetByIdAsync(id);
            return new OutgoingUpdateDTO(
                projectUpdate.Id,
                projectUpdate.Title,
                projectUpdate.ProjectId,
                projectUpdate.DateCreated,
                projectUpdate.Version
            );
        }
        catch (System.Exception e)
        {
            throw new(e.Message);
        }
    }

    Task<OutgoingUpdateDTO> IProjectUpdateService.UpdateAsync(
        ProjectUpdateDTO projectUpdateDTO,
        User loggedInUser
    )
    {
        //tills vi vet om vi har något att uppdatera på liksom
        throw new NotImplementedException();
    }
}
