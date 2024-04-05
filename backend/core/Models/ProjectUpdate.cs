// //edasat ägare kan lägga upp process/uppdatering
// process klass:
// updatenumber : vilken uppdatering det är, 1.2.3...
// projektID

namespace core;

public class ProjectUpdate
{
    public string Id { get; set; }
    public string Title{get;set;}
    public string ProjectId { get; set; }
    public Project Project { get; set; }
    public DateTime DateCreated { get; set; }
    public int Version { get; set; }

    public ProjectUpdate(string id, string title,string projectId, DateTime dateCreated, int version)
    {
        Id = id;
        Title = title;
        ProjectId = projectId;
        DateCreated = dateCreated;
        Version = version;
    }
}
