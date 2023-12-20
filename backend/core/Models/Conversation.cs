namespace core;

public class Conversation
{
    public int Id { get; set; }
    public DateTime DateCreated { get; set; }
    public User Creator { get; set; }
    public List<User> Participants { get; set; }
    public List<Message> Messages { get; set; } = new();

    public Conversation() { }
}
