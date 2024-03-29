// //edasat ägare kan lägga upp process/uppdatering
// process klass:
// updatenumber : vilken uppdatering det är, 1.2.3...
// projektID

namespace core;

public class ProjectUpdate
{
    public string Id { get; set; }
    public string ProjectId { get; set; }
    public Project Project { get; set; }
    public DateTime DateCreated { get; set; }
    public int Version { get; set; }

    public ProjectUpdate(string id, string projectId, DateTime dateCreated, int version)
    {
        Id = id;
        ProjectId = projectId;
        DateCreated = dateCreated;
        Version = version;
    }
}
