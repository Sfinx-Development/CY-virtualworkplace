namespace core;

public interface IHealthCheckService
{
    Task<HealthCheck> CreateHealthCheckAsync(HealthCheckDTO healthCheck, User loggedInUser);

    Task<HealthCheck> UpdateHealthCheck(HealthCheckDTO healthCheck, User loggedInUser);

    Task<HealthCheck> GetHealthCheckBykId(string id);
    Task<List<HealthCheck>> GetByTeam(string profileId, User loggedInUser);
    Task DeleteById(string id, User loggedInUser);
}
