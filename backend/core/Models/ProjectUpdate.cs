// //edasat ägare kan lägga upp process/uppdatering
// process klass:
// updatenumber : vilken uppdatering det är, 1.2.3...
// projektID

namespace core;

public class ProjectUpdate
{
    public string Id { get; set; }
    public string ProjectId { get; set; }
    public string Project { get; set; }
    public int Version { get; set; }
}
