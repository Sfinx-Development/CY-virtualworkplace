namespace core;

public class Team
{
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTime CreatedAt { get; set; }
    public string TeamRole { get; set; }
    List<User> Users { get; set; }

    public Team() { }
}
