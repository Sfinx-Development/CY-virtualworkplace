namespace core;

public class Cy
{
    public int Id { get; set; }
    List<HealthCheck> HealthChecks { get; set; }
    public int HealthCheckInterval { get; set; }

    public Cy() { }
}
