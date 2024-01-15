namespace core;

public class MeetingRoom : Room
{
    public Team Team { get; set; } = new();
    public string TeamId { get; set; }

    public MeetingRoom() { }
}
