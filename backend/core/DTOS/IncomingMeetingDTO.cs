namespace core;

public class IncomingMeetingDTO
{
    public string Name { get; set; }
    public string Description { get; set; }
    public DateTime Date { get; set; }
    public int Minutes { get; set; }
    public bool IsRepeating { get; set; }
    public string RoomId { get; set; }
}
