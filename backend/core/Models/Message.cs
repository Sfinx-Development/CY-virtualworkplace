namespace core;

public class Message
{
    public string Id { get; set; }
    public string Content { get; set; }
    public DateTime DateCreated { get; set; }

    //detta kan man lägga till senare:
    // public bool IsEdited{get;set;}
    public ConversationParticipant ConversationParticipant { get; set; }
    public string ConversationParticipantId { get; set; }
    public string ConversationId { get; set; }

    public Message(
        string id,
        string content,
        DateTime dateCreated,
        string conversationParticipantId,
        string conversationId
    )
    {
        Id = id;
        Content = content;
        DateCreated = dateCreated;
        ConversationParticipantId = conversationParticipantId;
        ConversationId = conversationId;
    }
}
