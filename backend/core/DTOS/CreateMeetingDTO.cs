namespace core;

public class CreateMeetingDTO
{
    public string Name { get; set; }
    public string Description { get; set; }
    public DateTime Date { get; set; }
    public int Minutes { get; set; }
    public bool IsRepeating { get; set; }
    public string OwnerId { get; set; }

    public int Interval { get; set; }
    public DateTime? EndDate { get; set; }
      public string? TeamId { get; set; }
}
