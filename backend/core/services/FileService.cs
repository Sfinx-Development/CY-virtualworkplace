using System;
using System.IO;
using System.Threading.Tasks;
using core;
using Interfaces;

public class FileService : IFileService
{
    private readonly string _fileStoragePath;

    public FileService(string fileStoragePath)
    {
        _fileStoragePath = fileStoragePath;
    }

    public async Task<ProjectFileDTO> CreateAsync(ProjectFileDTO fileDTO)
    {
        // Generera ett unikt filnamn baserat på tid och något slumpmässigt
        string uniqueFileName = $"{DateTime.Now.Ticks}_{Guid.NewGuid()}_{fileDTO.FileName}";

        // Bygg den fullständiga sökvägen där filen ska sparas
        string filePath = Path.Combine(_fileStoragePath, uniqueFileName);

        try
        {
            // Skriv filinnehållet till den angivna sökvägen
            await File.WriteAllBytesAsync(filePath, fileDTO.Content);

            var savedFile = new ProjectFile(
                Utils.GenerateRandomId(),
                uniqueFileName,
                fileDTO.Content,
                fileDTO.UpdateCommentId,
                filePath
            );

            return new ProjectFileDTO(
                savedFile.Id,
                savedFile.FileName,
                savedFile.Content,
                savedFile.UpdateCommentId,
                savedFile.FilePath
            );
        }
        catch (Exception ex)
        {
            throw new Exception("Failed to save file.", ex);
        }
    }
}
