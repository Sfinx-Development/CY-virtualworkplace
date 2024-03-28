namespace core;

public interface IFileService
{
    Task<ProjectFileDTO> CreateAsync(ProjectFileDTO fileDTO);
}
