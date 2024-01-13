namespace core;

public class MeetingOccasion
{
    public string Id { get; set; }
    public Meeting Meeting { get; set; }
    public Profile Profile { get; set; }
    public bool IsMeetingOwner { get; set; }

    public MeetingOccasion() { }
}
