namespace core;

public class Team
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Code { get; set; }
    public DateTime CreatedAt { get; set; }
    public string TeamRole { get; set; }
    public string ImageUrl { get; set; }
    public bool IsOpenForJoining { get; set; }
    public bool AllCanCreateMeetings { get; set; }
    public List<Profile> Profiles = new();

    public Team() { }

    public Team(
        string id,
        string name,
        string code,
        DateTime createdAt,
        string teamRole,
        string imageurl,
        bool isOpenForJoining,
        bool allCanCreateMeetings
    )
    {
        Id = id;
        Name = name;
        Code = code;
        CreatedAt = createdAt;
        TeamRole = teamRole;
        ImageUrl = imageurl;
        IsOpenForJoining = isOpenForJoining;
        AllCanCreateMeetings = allCanCreateMeetings;
    }
}
