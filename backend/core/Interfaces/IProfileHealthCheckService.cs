namespace core;

public interface IProfileHealthCheckService
{
    Task<ProfileHealthCheckDTO> CreateAsync(ProfileHealthCheckDTO healthCheck, User loggedInUser);

    Task<ProfileHealthCheckDTO> GetByIdAsync(string id);

    Task<ProfileHealthCheckDTO> UpdateAsync(ProfileHealthCheckDTO healthCheck, User loggedInUser);

    Task DeleteByIdAsync(string id, User loggedInUser);

    Task<IEnumerable<ProfileHealthCheckDTO>> GetAllByHealthCheck(
        string healthCheckId,
        User loggedInUser
    );

    Task<IEnumerable<ProfileHealthCheckDTO>> GetAllByProfileId(string profileId, User loggedInUser);
}
