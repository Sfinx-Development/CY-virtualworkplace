namespace core;

public class MeetingOccasion
{
    public int Id { get; set; }
    public Meeting Meeting { get; set; }
    public User User { get; set; }
    public bool IsMeetingOwner { get; set; }

    public MeetingOccasion() { }
}
