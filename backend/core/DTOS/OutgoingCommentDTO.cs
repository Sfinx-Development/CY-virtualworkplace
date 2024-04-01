namespace core;

public class OutgoingCommentDTO
{
    public string Id { get; set; }
    public string Text { get; set; }
    public string ProfileId { get; set; }
    public string ProjectUpdateId { get; set; }
    public string ProfileFullName { get; set; }
    public string DateCreated { get; set; }

    public OutgoingCommentDTO(
        string id,
        string text,
        string projectUpdateId,
        DateTime dateCreated,
        Profile profile
    )
    {
        Id = id;
        Text = text;
        ProfileId = profile.Id;
        ProjectUpdateId = projectUpdateId;
        DateCreated = dateCreated.ToString("yyyy-MM-ddTHH:mm:ss");
        ProfileFullName = profile.FullName;
    }
}
