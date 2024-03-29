namespace core;

public class ProjectUpdateDTO
{
    public string Id { get; set; }
    public string ProjectId { get; set; }
    public DateTime DateCreated { get; set; }
    public int Version { get; set; }

    public ProjectUpdateDTO(string id, string projectId, DateTime dateCreated, int version)
    {
        Id = id;
        ProjectId = projectId;
        DateCreated = dateCreated;
        Version = version;
    }
}
