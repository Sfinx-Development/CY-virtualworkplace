namespace core;

//heta kanske profileresult eller profilerating?
public class ProfileHealthCheck
{
    public string Id { get; set; }
    public DateTime Date { get; set; }
    public int Rating { get; set; }
    public bool IsAnonymous { get; set; }
    public Profile Profile { get; set; }
    public string ProfileId { get; set; }
    public HealthCheck HealthCheck { get; set; }
    public string HealthCheckId { get; set; }

    public ProfileHealthCheck(
        string id,
        DateTime date,
        int rating,
        bool isAnonymous,
        string profileId,
        string healthCheckId
    )
    {
        Id = id;
        Date = date;
        Rating = rating;
        IsAnonymous = isAnonymous;
        ProfileId = profileId;
        HealthCheckId = healthCheckId;
    }

    public ProfileHealthCheck() { }
}
