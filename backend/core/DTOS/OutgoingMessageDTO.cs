namespace core;

public class OutgoingMessageDTO
{
    public string Id { get; set; }
    public string Content { get; set; }
    public DateTime DateCreated { get; set; }
    public string ConversationParticipantId { get; set; }
    public string ConversationId { get; set; }
    public string FullName { get; set; }
    public string ProfileId { get; set; }

    public OutgoingMessageDTO(
        string content,
        DateTime dateCreated,
        string conversationParticipantId,
        string conversationId,
        string fullName,
        string profileId
    )
    {
        Id = Utils.GenerateRandomId();
        Content = content;
        DateCreated = dateCreated;
        ConversationParticipantId = conversationParticipantId;
        ConversationId = conversationId;
        FullName = fullName;
        ProfileId = profileId;
    }
}
