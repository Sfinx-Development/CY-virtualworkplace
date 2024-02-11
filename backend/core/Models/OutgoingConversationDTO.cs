namespace core;

public class OutgoingConversationDTO
{
    public string Id { get; set; }
    public DateTime DateCreated { get; set; }
    public string CreatorId { get; set; }
    public string? TeamId { get; set; }

    public OutgoingConversationDTO(
        string id,
        DateTime dateCreated,
        string creatorId,
        string? teamId
    )
    {
        Id = id;
        DateCreated = dateCreated;
        CreatorId = creatorId;
        TeamId = teamId;
    }
}
