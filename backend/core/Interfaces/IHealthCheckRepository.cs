namespace core;

public interface IHealthCheckRepository
{
    Task<HealthCheck> CreateAsync(HealthCheck healthCheck);

    Task<HealthCheck> GetByIdAsync(string id);

    Task<HealthCheck> UpdateAsync(HealthCheck healthCheck);

    Task DeleteByIdAsync(string id);

    Task<List<HealthCheck>> GetAllByTeam(string teamId);
}
