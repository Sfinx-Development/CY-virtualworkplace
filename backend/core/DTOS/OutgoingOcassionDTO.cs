namespace core;

public class OutgoingOcassionDTO
{
    public string Id { get; set; }
    public string MeetingId { get; set; }
    public string ProfileId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Date { get; set; }
    public int Minutes { get; set; }
    public string RoomId { get; set; }

    public OutgoingOcassionDTO(
        string id,
        string meetingId,
        string profileId,
        string name,
        string description,
        DateTime date,
        int minutes,
        string roomId
    )
    {
        Id = id;
        MeetingId = meetingId;
        ProfileId = profileId;
        Name = name;
        Description = description;
        Date = date.ToString("yyyy-MM-ddTHH:mm:ss");
        Minutes = minutes;
        RoomId = roomId;
    }
}
