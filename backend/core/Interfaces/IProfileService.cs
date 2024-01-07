using core;

namespace Interfaces;

public interface IProfileService
{
    Task<Profile> CreateProfile(User user, bool isOwner, string role, Team team);
    Task<List<Profile>> GetProfilesByUserId(User user);
    Task<Profile> UpdateProfile(Profile profile);
    Task DeleteProfile(Profile profile);
    Task DeleteTeamAndProfiles(DeleteTeamDTO deleteTeamDTO);

}

