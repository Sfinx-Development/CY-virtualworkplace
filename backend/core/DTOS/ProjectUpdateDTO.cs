namespace core;

public class ProjectUpdateDTO
{
    public string Id { get; set; }
    public string Title { get; set; }
    public string ProjectId { get; set; }
    public DateTime DateCreated { get; set; }
    public int Version { get; set; }

    public ProjectUpdateDTO(
        string id,
        string title,
        string projectId,
        DateTime dateCreated,
        int version
    )
    {
        Id = id;
        Title = title;
        ProjectId = projectId;
        DateCreated = dateCreated;
        Version = version;
    }
}
