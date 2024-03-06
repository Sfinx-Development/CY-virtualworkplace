namespace core;

public class Team
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Code { get; set; }
    public DateTime CreatedAt { get; set; }
    public string TeamRole { get; set; }

    //får vara PROFILENS ID:
    public string OwnerId { get; set; }
    public List<Profile> Profiles = new();

    public Team() { }
}
