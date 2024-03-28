namespace core;

public class UpdateComment
{
    public string Id { get; set; }
    public string Text { get; set; }
    public string ProfileId { get; set; }
    public string ProjectUpdateId { get; set; }

    // public DateTime DateCreated { get; set; }
    // public List<File> AttachedFiles { get; set; }
    public ProjectUpdate ProjectUpdate { get; set; }

    public UpdateComment() { }
}
