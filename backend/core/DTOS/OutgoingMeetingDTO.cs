namespace core;

public class OutgoingMeetingDTO
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Date { get; set; }
    public int Minutes { get; set; }
    public bool IsRepeating { get; set; }
    public string RoomId { get; set; }
    public string OwnerId { get; set; }
    public int Interval { get; set; }
    public string? EndDate { get; set; }

    public OutgoingMeetingDTO(
        string id,
        string name,
        string description,
        DateTime date,
        int minutes,
        bool isRepeating,
        string roomId,
        string ownerId,
        int interval,
        DateTime? endDate
    )
    {
        Id = id;
        Name = name;
        Description = description;
        Date = date.ToString("yyyy-MM-ddTHH:mm:ss");

        Minutes = minutes;
        IsRepeating = isRepeating;
        RoomId = roomId;
        OwnerId = ownerId;
        Interval = interval;

        // Formatera EndDate om det finns
        if (endDate.HasValue)
        {
            EndDate = endDate.Value.ToString("yyyy-MM-ddTHH:mm:ss");
        }
        else
        {
            EndDate = null;
        }
    }
}
