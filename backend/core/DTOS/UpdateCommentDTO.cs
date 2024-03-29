namespace core;

public class UpdateCommentDTO
{
    public string Id { get; set; }
    public string Text { get; set; }
    public string ProfileId { get; set; }
    public string ProjectUpdateId { get; set; }

    public DateTime DateCreated { get; set; }

    public UpdateCommentDTO(
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
        DateCreated = dateCreated;
    }
}
