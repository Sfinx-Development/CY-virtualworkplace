namespace core;

//detta är som en survey med en fråga per gång
public class Survey
{
    public string Id { get; set; }
    public Team Team { get; set; }
    public string TeamId { get; set; }
    public string Question { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }

    public Survey() { }

    public Survey(string id, string teamId, string question, DateTime startTime, DateTime endTime)
    {
        Id = id;
        TeamId = teamId;
        Question = question;
        StartTime = startTime;
        EndTime = endTime;
    }
}
