namespace core;

public class Profile
{
    public string Id { get; set; }
    public string Role { get; set; }
    public bool IsOwner { get; set; }
    public DateTime DateCreated { get; set; }
    public Team Team { get; set; }
    public User User { get; set; }
    public List<Conversation> Conversations = new();

    public Profile() { }
}
