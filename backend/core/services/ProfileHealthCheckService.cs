using Interfaces;

namespace core;

public class ProfileHealthCheckService : IProfileSurveyService
{
    private readonly IProfileSurveyRepository _profileHealthCheckRepository;
    private readonly ISurveyRepository _healthCheckRepository;
    private readonly IProfileRepository _profileRepository;
    private readonly ITeamRepository _teamRepository;

    public ProfileHealthCheckService(
        IProfileSurveyRepository profileHealthCheckRepository,
        ISurveyRepository healthCheckRepository,
        IProfileRepository profileRepository,
        ITeamRepository teamRepository
    )
    {
        _profileHealthCheckRepository = profileHealthCheckRepository;
        _healthCheckRepository = healthCheckRepository;
        _profileRepository = profileRepository;
        _teamRepository = teamRepository;
    }

    public async Task<ProfileHealthCheckDTO> CreateAsync(
        ProfileHealthCheckDTO incomingHealthCheck,
        User loggedInUser
    )
    {
        try
        {
            var profile = await _profileRepository.GetByIdAsync(incomingHealthCheck.ProfileId);
            if (profile.UserId != loggedInUser.Id)
            {
                throw new Exception("User does not belong to this profile.");
            }
            var healthCheck = await _healthCheckRepository.GetByIdAsync(
                incomingHealthCheck.HealthCheckId
            );
            var now = new DateTime();
            if (healthCheck == null)
            {
                throw new Exception("Healthcheck doesn't exist.");
            }
            else if (healthCheck.EndTime < now)
            {
                throw new Exception("Healtcheck endtime has passed.");
            }
            ProfileToSurvey profileHealthCheck =
                new(
                    Utils.GenerateRandomId(),
                    incomingHealthCheck.Date.AddHours(1),
                    incomingHealthCheck.Rating,
                    incomingHealthCheck.IsAnonymous,
                    incomingHealthCheck.ProfileId,
                    incomingHealthCheck.HealthCheckId
                );
            var createdProfileHealthCheck = await _profileHealthCheckRepository.CreateAsync(
                profileHealthCheck
            );
            return new ProfileHealthCheckDTO()
            {
                Id = createdProfileHealthCheck.Id,
                Date = createdProfileHealthCheck.Date,
                Rating = createdProfileHealthCheck.Rating,
                IsAnonymous = createdProfileHealthCheck.IsAnonymous,
                ProfileId = createdProfileHealthCheck.ProfileId,
                HealthCheckId = createdProfileHealthCheck.HealthCheckId
            };
        }
        catch (System.Exception e)
        {
            throw new(e.Message);
        }
    }

    public async Task DeleteByIdAsync(string id, User loggedInUser)
    {
        try
        {
            var profileHealthCheck = await _profileHealthCheckRepository.GetByIdAsync(id);
            var profile = await _profileRepository.GetByIdAsync(profileHealthCheck.ProfileId);
            if (profile.UserId != loggedInUser.Id || !profile.IsOwner)
            {
                throw new Exception("Only owner of result or the owner of team can delete result.");
            }
            await _profileHealthCheckRepository.DeleteByIdAsync(id);
        }
        catch (System.Exception e)
        {
            throw new(e.Message);
        }
    }

    public async Task<IEnumerable<ProfileHealthCheckDTO>> GetAllByHealthCheck(
        string healthCheckId,
        User loggedInUser
    )
    {
        try
        {
            var healthCheck = await _healthCheckRepository.GetByIdAsync(healthCheckId);
            var teams = await _teamRepository.GetByUserIdAsync(loggedInUser.Id);
            if (!teams.Any(t => t.Id == healthCheck.TeamId))
            {
                throw new Exception("You can only get results from your own team.");
            }
            var profileHealthChecks = await _profileHealthCheckRepository.GetAllByHealthCheck(
                healthCheck.Id
            );
            var profileHealthCheckDTOs = profileHealthChecks.Select(
                h =>
                    new ProfileHealthCheckDTO()
                    {
                        Id = h.Id,
                        Date = h.Date,
                        Rating = h.Rating,
                        IsAnonymous = h.IsAnonymous,
                        ProfileId = h.ProfileId,
                        HealthCheckId = h.HealthCheckId
                    }
            );
            if (profileHealthCheckDTOs == null || profileHealthCheckDTOs.Count() < 1)
            {
                profileHealthCheckDTOs = new List<ProfileHealthCheckDTO>();
            }
            return profileHealthCheckDTOs;
        }
        catch (System.Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<IEnumerable<ProfileHealthCheckDTO>> GetAllByProfileId(
        string profileId,
        User loggedInUser
    )
    {
        try
        {
            // var healthCheck = await _healthCheckRepository.GetByIdAsync(healthCheckId);
            // var teams = await _teamRepository.GetByUserIdAsync(loggedInUser.Id);
            // if (!teams.Any(t => t.Id == healthCheck.TeamId))
            // {
            //     throw new Exception("You can only get results from your own team.");
            // }
            var profileHealthChecks = await _profileHealthCheckRepository.GetAllByProfileId(
                profileId
            );
            var profileHealthCheckDTOs = profileHealthChecks.Select(
                h =>
                    new ProfileHealthCheckDTO()
                    {
                        Id = h.Id,
                        Date = h.Date,
                        Rating = h.Rating,
                        IsAnonymous = h.IsAnonymous,
                        ProfileId = h.ProfileId,
                        HealthCheckId = h.HealthCheckId
                    }
            );
            if (profileHealthCheckDTOs == null || profileHealthCheckDTOs.Count() < 1)
            {
                profileHealthCheckDTOs = new List<ProfileHealthCheckDTO>();
            }
            return profileHealthCheckDTOs;
        }
        catch (System.Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ProfileHealthCheckDTO> GetByIdAsync(string id)
    {
        try
        {
            //villkor?
            var profileHealthCheck = await _profileHealthCheckRepository.GetByIdAsync(id);
            return new ProfileHealthCheckDTO()
            {
                Id = profileHealthCheck.Id,
                Date = profileHealthCheck.Date,
                Rating = profileHealthCheck.Rating,
                IsAnonymous = profileHealthCheck.IsAnonymous,
                ProfileId = profileHealthCheck.ProfileId,
                HealthCheckId = profileHealthCheck.HealthCheckId
            };
        }
        catch (System.Exception e)
        {
            throw new(e.Message);
        }
    }

    public async Task<ProfileHealthCheckDTO> UpdateAsync(
        ProfileHealthCheckDTO profileHealthCheck,
        User loggedInUser
    )
    {
        try
        {
            var existingProfileHC = await _profileHealthCheckRepository.GetByIdAsync(
                profileHealthCheck.Id
            );
            var profile = await _profileRepository.GetByIdAsync(profileHealthCheck.ProfileId);
            if (profile.UserId != loggedInUser.Id)
            {
                throw new Exception("Only owner of result can update.");
            }
            var profileHCToUpdate = new ProfileToSurvey()
            {
                Id = profileHealthCheck.Id,
                Date = existingProfileHC.Date,
                Rating = profileHealthCheck.Rating,
                IsAnonymous = profileHealthCheck.IsAnonymous,
                ProfileId = existingProfileHC.ProfileId,
                HealthCheckId = existingProfileHC.HealthCheckId
            };
            var updatedProfileHC = await _profileHealthCheckRepository.UpdateAsync(
                profileHCToUpdate
            );
            return new ProfileHealthCheckDTO()
            {
                Id = updatedProfileHC.Id,
                Date = updatedProfileHC.Date,
                Rating = updatedProfileHC.Rating,
                IsAnonymous = updatedProfileHC.IsAnonymous,
                ProfileId = updatedProfileHC.ProfileId,
                HealthCheckId = updatedProfileHC.HealthCheckId
            };
        }
        catch (System.Exception e)
        {
            throw new(e.Message);
        }
    }
}
