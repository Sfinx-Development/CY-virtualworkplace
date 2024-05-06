namespace core;

public class Conversation
{
    public string Id { get; set; }
    public DateTime DateCreated { get; set; }
    public string CreatorId { get; set; }
    public string? TeamId { get; set; }
    public List<Message> Messages { get; set; }

    public Conversation() { }
    public Conversation(string id, DateTime dateCreated, string creatorId, string teamId) {
        Id = id;
        DateCreated = dateCreated;
        CreatorId = creatorId;
        TeamId = teamId;
     }
}
