namespace core;

public class ProfileService
{
    private readonly ProfileRepository _profileRepository;
    private readonly TeamRepository _teamRepository;
    private readonly UserRepository _userRepository;
    private static readonly Random random = new Random();

    public ProfileService(
        ProfileRepository profileRepository,
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

    public async Task<Profile> GetProfileByUserId(User user)
    {
        return new Profile();
    }

    public async Task<Profile> UpdateProfile(Profile profile)
    {
        return new Profile();
    }

    public async Task DeleteProfile(Profile profile) { }

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
}
