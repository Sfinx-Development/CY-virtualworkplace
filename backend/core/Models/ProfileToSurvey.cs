namespace core;

public class ProfileToSurvey
{
    public string Id { get; set; }
    public DateTime Date { get; set; }
    public int Rating { get; set; }
    public bool IsAnonymous { get; set; }
    public Profile Profile { get; set; }
    public string ProfileId { get; set; }
    public Survey Survey { get; set; }
    public string SurveyId { get; set; }

    public ProfileToSurvey(
        string id,
        DateTime date,
        int rating,
        bool isAnonymous,
        string profileId,
        string surveyId
    )
    {
        Id = id;
        Date = date;
        Rating = rating;
        IsAnonymous = isAnonymous;
        ProfileId = profileId;
        SurveyId = surveyId;
    }

    public ProfileToSurvey() { }
}
