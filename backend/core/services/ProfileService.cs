using core.Migrations;
using Interfaces;

namespace core;

public class ProfileService : IProfileService
{
    private readonly MeetingRoomRepository _profileRepository;
    private readonly TeamRepository _teamRepository;
    private readonly UserRepository _userRepository;
    private static readonly Random random = new Random();

    public ProfileService(
        MeetingRoomRepository profileRepository,
        UserRepository userRepository,
        TeamRepository teamRepository
    )
    {
        _profileRepository = profileRepository;
        _userRepository = userRepository;
        _teamRepository = teamRepository;
    }

    public async Task<Profile> CreateProfile(User user, bool isOwner, string role, Team team)
    {
        Profile newProfile =
            new()
            {
                Id = GenerateRandomId(),
                IsOwner = isOwner,
                User = user,
                DateCreated = DateTime.UtcNow,
                Role = role,
                Team = team
            };
        Profile createdProfile = await _profileRepository.CreateAsync(newProfile);
        return createdProfile;
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

    public async Task<Profile> UpdateProfile(Profile profile)
    {
        try
        {
            var foundProfile =
                await _profileRepository.GetByIdAsync(profile.Id) ?? throw new Exception();
            foundProfile.Role = profile.Role;
            var updatedProfile = await _profileRepository.UpdateAsync(foundProfile);
            return updatedProfile;
        }
        catch (Exception)
        {
            throw new Exception();
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

    public static string GenerateRandomId(int length = 8)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        char[] idArray = new char[length];

        for (int i = 0; i < length; i++)
        {
            idArray[i] = chars[random.Next(chars.Length)];
        }

        return new string(idArray);
    }

    public async Task DeleteTeamAndProfiles(DeleteTeamDTO deleteTeamDTO)
    {
        try
        {
            var profile = await _profileRepository.GetByIdAsync(deleteTeamDTO.ProfileId);

            if (profile.IsOwner == true)
            {
                var team = await _teamRepository.GetByIdAsync(deleteTeamDTO.TeamId);
                var profilesInTeam = await _profileRepository.GetProfilesInTeamAsync(
                    deleteTeamDTO.TeamId
                );

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
