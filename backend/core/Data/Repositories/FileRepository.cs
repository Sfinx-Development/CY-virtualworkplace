using Microsoft.EntityFrameworkCore;

namespace core;

public class FileRepository : IFileRepository
{
    private readonly CyDbContext _cyDbContext;

    public FileRepository(CyDbContext cyDbContext)
    {
        _cyDbContext = cyDbContext;
    }

    public async Task<ProjectFile> CreateAsync(ProjectFile projectFile)
    {
        try
        {
            await _cyDbContext.ProjectFiles.AddAsync(projectFile);
            await _cyDbContext.SaveChangesAsync();
            return projectFile;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ProjectFile> GetByIdAsync(string id)
    {
        try
        {
            ProjectFile file = await _cyDbContext.ProjectFiles.Where(m => m.Id == id).FirstAsync();

            if (file != null)
            {
                return file;
            }
            else
            {
                throw new Exception("file not found.");
            }
        }
        catch (Exception e)
        {
            throw new Exception();
        }
    }

    public async Task<ProjectFile> UpdateAsync(ProjectFile file)
    {
        try
        {
            _cyDbContext.ProjectFiles.Update(file);

            await _cyDbContext.SaveChangesAsync();
            return file;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task DeleteByIdAsync(string id)
    {
        try
        {
            var fileToDelete = await _cyDbContext.ProjectFiles.FindAsync(id);
            if (fileToDelete != null)
            {
                _cyDbContext.ProjectFiles.Remove(fileToDelete);
                await _cyDbContext.SaveChangesAsync();
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<List<ProjectFile>> GetAllByUpdateComment(string updateCommentId)
    {
        try
        {
            var files = await _cyDbContext
                .ProjectFiles.Where(m => m.UpdateCommentId == updateCommentId)
                .ToListAsync();
            return files;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}
