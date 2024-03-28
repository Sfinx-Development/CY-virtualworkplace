// projekt klassen:
// titel
// beskrivning
// date created
// spannet datum
// teamid

namespace core;

public class Project
{
    public string Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime DateCreated { get; set; }
    public string TeamId { get; set; }
    public Team Team{get;set;}

    public Project() { }
}
