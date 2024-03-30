using Interfaces;

namespace core;

public class UpdateCommentService : IUpdateCommentService
{
    private readonly IProjectUpdateRepository _projectUpdateRepository;
    private readonly IProfileRepository _profileRepository;
    private readonly IUpdateCommentRepository _updateRepository;
    private readonly ITeamRepository _teamRepository;

    public UpdateCommentService(
        IProjectUpdateRepository projectUpdateRepository,
        IProfileRepository profileRepository,
        ITeamRepository teamRepository,
        IUpdateCommentRepository updateCommentRepository
    )
    {
        _projectUpdateRepository = projectUpdateRepository;
        _profileRepository = profileRepository;
        _teamRepository = teamRepository;
        _updateRepository = updateCommentRepository;
    }

    public async Task<OutgoingCommentDTO> CreateAsync(
        UpdateCommentDTO updateCommentDTO,
        User loggedInUser
    )
    {
        try
        {
            var projectUpdate = await _projectUpdateRepository.GetByIdAsync(
                updateCommentDTO.ProjectUpdateId
            );
            var profile = await _profileRepository.GetByUserAndTeamIdAsync(
                loggedInUser.Id,
                projectUpdate.Project.TeamId
            );
            if (profile.UserId != loggedInUser.Id)
            {
                throw new Exception("User does not belong to this profile.");
            }

            var newUpdate = new UpdateComment(
                Utils.GenerateRandomId(),
                updateCommentDTO.Text,
                updateCommentDTO.ProfileId,
                updateCommentDTO.ProjectUpdateId,
                DateTime.Now
            );
            var createdUpdate = await _updateRepository.CreateAsync(newUpdate);
            var createdUpdateDTO = new OutgoingCommentDTO(
                createdUpdate.Id,
                createdUpdate.Text,
                createdUpdate.ProfileId,
                createdUpdate.ProjectUpdateId,
                createdUpdate.DateCreated
            );
            return createdUpdateDTO;
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
            var updateComment = await _updateRepository.GetByIdAsync(id);
            var profile = await _profileRepository.GetByUserAndTeamIdAsync(
                loggedInUser.Id,
                updateComment.ProjectUpdate.Project.TeamId
            );
            if (profile.UserId != loggedInUser.Id)
            {
                throw new Exception("User does not belong to this profile.");
            }
            await _updateRepository.DeleteByIdAsync(id);
        }
        catch (Exception e)
        {
            throw new(e.Message);
        }
    }

    public async Task<IEnumerable<OutgoingCommentDTO>> GetAllByProjectUpdate(
        string projectUpdateId,
        User loggedInUser
    )
    {
        try
        {
            var projectUpdate = await _projectUpdateRepository.GetByIdAsync(projectUpdateId);
            var teams = await _teamRepository.GetByUserIdAsync(loggedInUser.Id);
            if (!teams.Any(t => t.Id == projectUpdate.Project.TeamId))
            {
                throw new Exception("You can only get results from your own team.");
            }
            var updateComments = await _updateRepository.GetAllByProjectUpdate(projectUpdate.Id);
            var updateCommentDTOs = updateComments.Select(
                u =>
                    new OutgoingCommentDTO(
                        u.Id,
                        u.Text,
                        u.ProfileId,
                        u.ProjectUpdateId,
                        u.DateCreated
                    )
            );
            return updateCommentDTOs ?? new List<OutgoingCommentDTO>();
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<OutgoingCommentDTO> GetByIdAsync(string id)
    {
        try
        {
            //villkor?
            var updateComment = await _updateRepository.GetByIdAsync(id);
            return new OutgoingCommentDTO(
                updateComment.Id,
                updateComment.Text,
                updateComment.ProfileId,
                updateComment.ProjectUpdateId,
                updateComment.DateCreated
            );
        }
        catch (Exception e)
        {
            throw new(e.Message);
        }
    }

    public async Task<OutgoingCommentDTO> UpdateAsync(
        UpdateCommentDTO updateCommentDTO,
        User loggedInUser
    )
    {
        try
        {
            var existingProjectUpdate = await _projectUpdateRepository.GetByIdAsync(
                updateCommentDTO.ProjectUpdateId
            );

            var profile = await _profileRepository.GetByUserAndTeamIdAsync(
                loggedInUser.Id,
                existingProjectUpdate.Project.TeamId
            );

            if (profile.UserId != loggedInUser.Id)
            {
                throw new Exception("User does not belong to this profile.");
            }
            var existingUpdate = await _updateRepository.GetByIdAsync(updateCommentDTO.Id);

            existingUpdate.Text = updateCommentDTO.Text;

            var createdUpdate = await _updateRepository.UpdateAsync(existingUpdate);
            var createdUpdateDTO = new OutgoingCommentDTO(
                createdUpdate.Id,
                createdUpdate.Text,
                createdUpdate.ProfileId,
                createdUpdate.ProjectUpdateId,
                createdUpdate.DateCreated
            );
            return createdUpdateDTO;
        }
        catch (Exception e)
        {
            throw new(e.Message);
        }
    }
}
