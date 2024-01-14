using Interfaces;

namespace core;

public class ProfileService : IProfileService
{
    private readonly IProfileRepository _profileRepository;
    private readonly ITeamRepository _teamRepository;
    private readonly IUserRepository _userRepository;
    private readonly IOfficeService _officeService;

    public ProfileService(
        IProfileRepository profileRepository,
        IUserRepository userRepository,
        ITeamRepository teamRepository,
        IOfficeService officeService
    )
    {
        _profileRepository = profileRepository;
        _userRepository = userRepository;
        _teamRepository = teamRepository;
        _officeService = officeService;
    }

    public async Task<Profile> CreateProfile(User user, bool isOwner, string role, Team team)
    {
        Profile newProfile =
            new()
            {
                Id = Utils.GenerateRandomId(),
                IsOwner = isOwner,
                User = user,
                DateCreated = DateTime.UtcNow,
                Role = role,
                Team = team
            };
        Profile createdProfile = await _profileRepository.CreateAsync(newProfile);
        Office office = await _officeService.CreateOffice(createdProfile);
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

 public async Task CantLeaveTeamIfOwner(Profile profile)
{
    try
    {
        var foundProfile = await _profileRepository.GetByIdAsync(profile.Id) ?? throw new Exception();

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
