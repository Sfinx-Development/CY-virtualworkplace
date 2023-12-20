namespace core;

public class HealthCheck
{
    public int Id { get; set; }
    public DateTime HealthCheckTime { get; set; }
    public Cy Cy { get; set; }
    public int HealthAverageStat { get; set; }

    public HealthCheck() { }
}
