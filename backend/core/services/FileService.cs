using Interfaces;
using Microsoft.Extensions.Configuration;

namespace core;

public class FileService : IFileService
{
    private readonly IProjectRepository _projectRepository;
    private readonly IFileRepository _fileRepository;
    private readonly IUpdateCommentRepository _updateCommentRepository;
    private readonly IProfileRepository _profileRepository;
    private readonly IConfiguration _configuration;

    public FileService(
        IProjectRepository projectRepository,
        IFileRepository fileRepository,
        IUpdateCommentRepository updateCommentRepository,
        IProfileRepository profileRepository,
        IConfiguration configuration
    )
    {
        _projectRepository = projectRepository;
        _fileRepository = fileRepository;
        _updateCommentRepository = updateCommentRepository;
        _profileRepository = profileRepository;
        _configuration = configuration;
    }

    public async Task<ProjectFileDTO> CreateAsync(ProjectFileDTO fileDTO)
    {
        string uniqueFileName = $"{DateTime.Now.Ticks}_{Guid.NewGuid()}_{fileDTO.FileName}";
        string filesDirectory = _configuration["FileSettings:FilesDirectory"];
        string filePath = Path.Combine(filesDirectory, uniqueFileName);

        try
        {
            //provar utan att spara den på servern:
            // await File.WriteAllBytesAsync(filePath, fileDTO.Content);

            var savedFile = new ProjectFile(
                Utils.GenerateRandomId(),
                uniqueFileName,
                fileDTO.Content,
                fileDTO.UpdateCommentId,
                filePath
            );

            var created = await _fileRepository.CreateAsync(savedFile);

            return new ProjectFileDTO(
                created.Id,
                created.FileName,
                created.Content,
                created.UpdateCommentId,
                created.FilePath
            );
        }
        catch (Exception ex)
        {
            throw new Exception("Failed to save file.", ex);
        }
    }

    public async Task DeleteById(string id, User loggedInUser)
    {
        try
        {
            var file = await _fileRepository.GetByIdAsync(id);
            var updateComment = await _updateCommentRepository.GetByIdAsync(file.UpdateCommentId);
            var projet = await _projectRepository.GetByIdAsync(
                updateComment.ProjectUpdate.ProjectId
            );
            var profile =
                await _profileRepository.GetByUserAndTeamIdAsync(loggedInUser.Id, projet.TeamId)
                ?? throw new Exception("Not valid user for this request.");

            await _fileRepository.DeleteByIdAsync(id);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ProjectFileDTO> GetById(string id, User loggedInUser)
    {
        try
        {
            var file = await _fileRepository.GetByIdAsync(id);
            var updateComment = await _updateCommentRepository.GetByIdAsync(file.UpdateCommentId);
            var projet = await _projectRepository.GetByIdAsync(
                updateComment.ProjectUpdate.ProjectId
            );
            var profile =
                await _profileRepository.GetByUserAndTeamIdAsync(loggedInUser.Id, projet.TeamId)
                ?? throw new Exception("Not valid user for this request.");
            return new ProjectFileDTO(
                file.Id,
                file.FileName,
                file.Content,
                file.UpdateCommentId,
                file.FilePath
            );
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<List<ProjectFileDTO>> GetByUpdateComment(
        string updateCommentId,
        User loggedInUser
    )
    {
        try
        {
            var updateComment = await _updateCommentRepository.GetByIdAsync(updateCommentId);
            var projet = await _projectRepository.GetByIdAsync(
                updateComment.ProjectUpdate.ProjectId
            );
            var profile =
                await _profileRepository.GetByUserAndTeamIdAsync(loggedInUser.Id, projet.TeamId)
                ?? throw new Exception("Not valid user for this request.");

            var filesByUpdateComment =
                await _fileRepository.GetAllByUpdateComment(updateCommentId)
                ?? new List<ProjectFile>();
            var filesDTOs = new List<ProjectFileDTO>();
            filesDTOs = filesByUpdateComment
                .Select(
                    f =>
                        new ProjectFileDTO(
                            f.Id,
                            f.FileName,
                            f.Content,
                            f.UpdateCommentId,
                            f.FilePath
                        )
                )
                .ToList();
            return filesDTOs;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ProjectFileDTO> UpdateAsync(ProjectFileDTO fileDTO, User loggedInUser)
    {
        throw new NotImplementedException();
    }

    // private async Task<Boolean> IsRequestValid(ProjectFileDTO projectFileDTO, User loggedInUser)
    // {
    //     try
    //     {
    //         var updateComment = await _updateCommentRepository.GetByIdAsync(
    //             projectFileDTO.UpdateCommentId
    //         );
    //         var projet = await _projectRepository.GetByIdAsync(
    //             updateComment.ProjectUpdate.ProjectId
    //         );
    //         var profile = await _profileRepository.GetByUserAndTeamIdAsync(
    //             loggedInUser.Id,
    //             projet.TeamId
    //         );
    //         if (profile != null)
    //         {
    //             return true;
    //         }
    //         return false;
    //     }
    //     catch (Exception e)
    //     {
    //         return false;
    //     }
    // }
}
