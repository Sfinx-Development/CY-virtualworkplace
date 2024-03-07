namespace core;

public interface IProfileHealthCheckRepository
{
    Task<ProfileHealthCheck> CreateAsync(ProfileHealthCheck healthCheck);

    Task<ProfileHealthCheck> GetByIdAsync(string id);

    Task<ProfileHealthCheck> UpdateAsync(ProfileHealthCheck healthCheck);

    Task DeleteByIdAsync(string id);

    Task<IEnumerable<ProfileHealthCheck>> GetAllByHealthCheck(string healthCheckId);
}
