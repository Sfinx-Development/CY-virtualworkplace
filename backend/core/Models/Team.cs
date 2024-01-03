namespace core;

public class Team
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Code { get; set; }
    public DateTime CreatedAt { get; set; }
    public string TeamRole { get; set; }
    public List<Profile> Profiles = new();

    public Team() { }
}
