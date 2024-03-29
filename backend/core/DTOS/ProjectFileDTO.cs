namespace core;

public class ProjectFileDTO
{
    public string Id { get; set; }
    public string FileName { get; set; }
    public byte[] Content { get; set; }
    public string UpdateCommentId { get; set; }
    public string FilePath { get; set; }

    public ProjectFileDTO(
        string id,
        string fileName,
        byte[] content,
        string updateCommentId,
        string filePath
    )
    {
        Id = id;
        FileName = fileName;
        Content = content;
        UpdateCommentId = updateCommentId;
        FilePath = filePath;
    }
}
