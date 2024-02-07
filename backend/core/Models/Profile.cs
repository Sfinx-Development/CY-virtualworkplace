namespace core;

public class Profile
{
    public string Id { get; set; }
    public string FullName { get; set; }
    public string Role { get; set; }
    public bool IsOwner { get; set; }
    public Team Team { get; set; }
    public User User { get; set; } = new();
    public string UserId { get; set; }
    public string TeamId { get; set; }
    public DateTime DateCreated { get; set; }
    public bool? IsOnline { get; set; }
    public DateTime? LastOnline { get; set; }
    public DateTime? LastActive { get; set; }

    //den sätts OM MAN VÄLJER DET I TEAMET SEN? om profilen är inne i mötesrummet typ?
    public List<ConversationParticipant> ConversationParticipants { get; set; }

    public Profile() { }
}
