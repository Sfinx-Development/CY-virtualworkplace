// processcomment:
// text
// profilId
// processId
// date created

namespace core;

public class UpdateComment
{
    public string Id { get; set; }
    public string Text { get; set; }
    public string ProfileId { get; set; }
    public string ProjectUpdateId { get; set; }
    public DateTime DateCreated { get; set; }
}
