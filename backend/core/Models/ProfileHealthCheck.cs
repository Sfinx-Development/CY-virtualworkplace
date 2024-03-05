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
}
