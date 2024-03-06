namespace core;

//detta är som en survey med en fråga per gång
public class HealthCheckDTO
{
    public string Id { get; set; }
    public string TeamId { get; set; }
    public string Question { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }

    public HealthCheckDTO() { }

    public HealthCheckDTO(
        string id,
        string teamId,
        string question,
        DateTime startTime,
        DateTime endTime
    )
    {
        Id = id;
        TeamId = teamId;
        Question = question;
        StartTime = startTime;
        EndTime = endTime;
    }
}
