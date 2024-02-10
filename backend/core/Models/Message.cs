namespace core;

public class Message
{
    public string Id { get; set; }
    public string Content { get; set; }
    public DateTime DateCreated { get; set; }
    public ConversationParticipant ConversationParticipant { get; set; }
    public string ConversationParticipantId { get; set; }
    public string ConversationId { get; set; }

    public Message() { }
}
