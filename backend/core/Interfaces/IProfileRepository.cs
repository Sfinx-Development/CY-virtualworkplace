using core;

namespace Interfaces;

public interface IProfileRepository
{
    Task<List<Profile>> GetByUserIdAsync(string userId);

    Task<List<Profile>> GetProfilesInTeamAsync(string teamId);
    Task<List<Profile>> GetOnlineProfilesInTeamAsync(string teamId);

    Task<Profile> GetByIdAsync(string profileId);

    Task<Profile> CreateAsync(Profile profile);

    Task<Profile> UpdateAsync(ProfileUpdateDTO profile);

    Task DeleteByIdAsync(string id);
}
