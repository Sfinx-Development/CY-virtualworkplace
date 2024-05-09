using Interfaces;

namespace core;

public class ProfileService : IProfileService
{
    private readonly IProfileRepository _profileRepository;
    private readonly ITeamRepository _teamRepository;
    private readonly IUserRepository _userRepository;
    private readonly IConversationService _conversationService;

    public ProfileService(
        IProfileRepository profileRepository,
        IUserRepository userRepository,
        ITeamRepository teamRepository,
        IConversationService conversationService
    )
    {
        _profileRepository = profileRepository;
        _userRepository = userRepository;
        _teamRepository = teamRepository;
        _conversationService = conversationService;
    }

    public async Task<List<Profile>> GetProfilesByTeamId(string userId, string teamId)
    {
        try
        {
            var team = await _teamRepository.GetByIdAsync(teamId);

            if (team.Profiles.Any(p => p.UserId == userId))
            {
                return await _profileRepository.GetProfilesInTeamAsync(teamId);
            }
            else
            {
                throw new Exception("user is not registered as a team member");
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<Profile> CreateProfile(User user, bool isOwner, string role, Team team)
    {
        Profile newProfile =
            new()
            {
                Id = Utils.GenerateRandomId(),
                FullName = user.FirstName + " " + user.LastName,
                IsOwner = isOwner,
                User = user,
                DateCreated = DateTime.UtcNow,
                Role = role,
                Team = team
            };

        Profile createdProfile = await _profileRepository.CreateAsync(newProfile);

        return createdProfile;
    }

    public async Task<Profile> GetProfileByAuthAndTeam(User user, string teamId)
    {
        try
        {
            var profiles = await _profileRepository.GetByUserIdAsync(user.Id);
            var profileInTeam = profiles.Where(p => p.TeamId == teamId).First();

            if (profileInTeam == null)
            {
                throw new Exception("profile doesnt exist");
            }
            else
            {
                return profileInTeam;
            }
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task<List<Profile>> GetProfilesByUserId(User user)
    {
        try
        {
            var profiles = await _profileRepository.GetByUserIdAsync(user.Id);

            if (profiles == null || profiles.Count < 1)
            {
                throw new Exception("profileId doesnt exist");
            }
            else
            {
                return profiles;
            }
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task<List<ProfileHboDTO>> GetOnlineProfilesByTeam(User user, string teamId)
    {
        try
        {
            var team = await _teamRepository.GetByIdAsync(teamId);
            if (team.Profiles.Any(p => p.UserId == user.Id))
            {
                var onlineProfiles = await _profileRepository.GetOnlineProfilesInTeamAsync(team.Id);
                List<ProfileHboDTO> onlineProfilesDTO = new();
                onlineProfilesDTO = onlineProfiles
                    .Select(
                        p =>
                            new ProfileHboDTO(
                                p.Id,
                                p.FullName,
                                p.TeamId,
                                p.IsOnline,
                                p.LastOnline,
                                p.LastActive
                            )
                    )
                    .ToList();
                return onlineProfilesDTO;
            }
            throw new Exception("Endast team medlem kan hämta info om online profiler.");
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task<Profile> UpdateProfile(ProfileUpdateDTO profile)
    {
        try
        {
            // var foundProfile =
            //     await _profileRepository.GetByIdAsync(profile.Id) ?? throw new Exception();
            // foundProfile.Role = profile.Role;
            var updatedProfile = await _profileRepository.UpdateAsync(profile);
            return updatedProfile;
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task CantLeaveTeamIfOwner(Profile profile)
    {
        try
        {
            var foundProfile =
                await _profileRepository.GetByIdAsync(profile.Id) ?? throw new Exception();

            if (foundProfile.IsOwner)
            {
                throw new Exception("Team owner cannot leave the team.");
            }

            await DeleteProfile(profile);
        }
        catch (Exception ex)
        {
            throw new Exception("Failed to leave the team.", ex);
        }
    }

    public async Task DeleteProfile(Profile profile)
    {
        try
        {
            if (profile != null)
            {
                await _profileRepository.DeleteByIdAsync(profile.Id);
            }
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task DeleteTeamAndProfiles(string teamId, User loggedInUser)
    {
        try
        {
            var profile = await _profileRepository.GetByUserAndTeamIdAsync(loggedInUser.Id, teamId);

            if (profile.IsOwner == true)
            {
                var team = await _teamRepository.GetByIdAsync(teamId);
                var profilesInTeam = await _profileRepository.GetProfilesInTeamAsync(teamId);

                foreach (var p in profilesInTeam)
                {
                    await _profileRepository.DeleteByIdAsync(p.Id);
                }
                await _teamRepository.DeleteByIdAsync(team.Id);
            }
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }
}
