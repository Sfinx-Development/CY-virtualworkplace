namespace core;

public class SurveyDTO
{
    public string Id { get; set; }
    public string TeamId { get; set; }
    public string Question { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }

    public SurveyDTO() { }

    public SurveyDTO(
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
