namespace core;

public class Conversation
{
    public int Id { get; set; }
    public DateTime DateCreated { get; set; }
    public Profile Creator { get; set; }
    public List<Profile> Participants { get; set; }
    public List<Message> Messages { get; set; } = new();

    public Conversation() { }
}
