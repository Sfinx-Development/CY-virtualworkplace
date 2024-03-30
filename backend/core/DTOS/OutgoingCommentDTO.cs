namespace core;

public class OutgoingCommentDTO
{
    public string Id { get; set; }
    public string Text { get; set; }
    public string ProfileId { get; set; }
    public string ProjectUpdateId { get; set; }

    public string DateCreated { get; set; }

    public OutgoingCommentDTO(
        string id,
        string text,
        string profileId,
        string projectUpdateId,
        DateTime dateCreated
    )
    {
        Id = id;
        Text = text;
        ProfileId = profileId;
        ProjectUpdateId = projectUpdateId;
        DateCreated = dateCreated.ToString("yyyy-MM-ddTHH:mm:ss");
        ;
    }
}
