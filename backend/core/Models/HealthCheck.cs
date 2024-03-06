namespace core;

//detta är som en survey med en fråga per gång
public class HealthCheck
{
    public string Id { get; set; }
    public Team Team { get; set; }
    public string TeamId { get; set; }
    public string Question { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }

    public HealthCheck() { }
}
