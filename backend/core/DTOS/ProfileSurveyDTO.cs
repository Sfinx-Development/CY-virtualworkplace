namespace core;

public class ProfileSurveyDTO
{
    public string Id { get; set; }
    public DateTime Date { get; set; }
    public int Rating { get; set; }
    public bool IsAnonymous { get; set; }
    public string ProfileId { get; set; }
    public string SurveyId { get; set; }
}
