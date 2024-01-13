namespace core;

public class MeetingRoom
{
    public string Id { get; set; }
    public Team Team { get; set; }

    //enum eventuellt
    public string RoomLayout { get; set; }
    public Cy Cy { get; set; }

    public MeetingRoom(){}
}
