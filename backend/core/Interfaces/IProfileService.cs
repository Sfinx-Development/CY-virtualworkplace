using core;

namespace Interfaces;

public interface IProfileService
{
    Task<Profile> CreateProfile(User user, bool isOwner, string role, Team team);
    Task<List<Profile>> GetProfilesByUserId(User user);
    Task<Profile> UpdateProfile(ProfileUpdateDTO profile);
    Task CantLeaveTeamIfOwner(Profile profile);
    Task<Profile> GetProfileByAuthAndTeam(User user, string teamId);
    Task DeleteProfile(Profile profile);
    Task DeleteTeamAndProfiles(string teamId, User loggedInUser);
    Task<List<Profile>> GetProfilesByTeamId(string userId, string teamId);
    Task<List<ProfileHboDTO>> GetOnlineProfilesByTeam(User user, string teamId);
}
