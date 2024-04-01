namespace core;

public class MeetingOccasion
{
    public string Id { get; set; }
    public Meeting Meeting { get; set; }
    public string MeetingId { get; set; }
    public Profile Profile { get; set; }
    public string ProfileId { get; set; }

    public MeetingOccasion() { }
}
