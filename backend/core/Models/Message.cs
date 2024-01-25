namespace core;

public class Message
{
    public string Id { get; set; }
    public string Content { get; set; }
    public DateOnly DateCreated { get; set; }
    public ConversationParticipant ConversationParticipant {get; set;}
    public string ConversationParticipantId {get; set;}
    public Message() { }
}
