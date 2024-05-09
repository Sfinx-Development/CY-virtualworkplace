using Interfaces;

namespace core;

public class ProfileSurveyService : IProfileSurveyService
{
    private readonly IProfileSurveyRepository _profileSurveyRepository;
    private readonly ISurveyRepository _healthCheckRepository;
    private readonly IProfileRepository _profileRepository;
    private readonly ITeamRepository _teamRepository;

    public ProfileSurveyService(
        IProfileSurveyRepository profileSurveyRepository,
        ISurveyRepository healthCheckRepository,
        IProfileRepository profileRepository,
        ITeamRepository teamRepository
    )
    {
        _profileSurveyRepository = profileSurveyRepository;
        _healthCheckRepository = healthCheckRepository;
        _profileRepository = profileRepository;
        _teamRepository = teamRepository;
    }

    public async Task<ProfileSurveyDTO> CreateAsync(
        ProfileSurveyDTO incomingSurvey,
        User loggedInUser
    )
    {
        try
        {
            var profile = await _profileRepository.GetByIdAsync(incomingSurvey.ProfileId);
            if (profile.UserId != loggedInUser.Id)
            {
                throw new Exception("User does not belong to this profile.");
            }
            var healthCheck = await _healthCheckRepository.GetByIdAsync(incomingSurvey.SurveyId);
            var now = new DateTime();
            if (healthCheck == null)
            {
                throw new Exception("Survey doesn't exist.");
            }
            else if (healthCheck.EndTime < now)
            {
                throw new Exception("Survey endtime has passed.");
            }
            ProfileToSurvey profileSurvey =
                new(
                    Utils.GenerateRandomId(),
                    incomingSurvey.Date.AddHours(1),
                    incomingSurvey.Rating,
                    incomingSurvey.IsAnonymous,
                    incomingSurvey.ProfileId,
                    incomingSurvey.SurveyId
                );
            var createdProfileSurvey = await _profileSurveyRepository.CreateAsync(profileSurvey);
            return new ProfileSurveyDTO()
            {
                Id = createdProfileSurvey.Id,
                Date = createdProfileSurvey.Date,
                Rating = createdProfileSurvey.Rating,
                IsAnonymous = createdProfileSurvey.IsAnonymous,
                ProfileId = createdProfileSurvey.ProfileId,
                SurveyId = createdProfileSurvey.SurveyId
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
            var profileSurvey = await _profileSurveyRepository.GetByIdAsync(id);
            var profile = await _profileRepository.GetByIdAsync(profileSurvey.ProfileId);
            if (profile.UserId != loggedInUser.Id || !profile.IsOwner)
            {
                throw new Exception("Only owner of result or the owner of team can delete result.");
            }
            await _profileSurveyRepository.DeleteByIdAsync(id);
        }
        catch (System.Exception e)
        {
            throw new(e.Message);
        }
    }

    public async Task<IEnumerable<ProfileSurveyDTO>> GetAllBySurvey(
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
            var profileSurveys =
                await _profileSurveyRepository.GetAllBySurvey(healthCheck.Id)
                ?? new List<ProfileToSurvey>();
            var profileSurveyDTOs = profileSurveys.Select(
                h =>
                    new ProfileSurveyDTO()
                    {
                        Id = h.Id,
                        Date = h.Date,
                        Rating = h.Rating,
                        IsAnonymous = h.IsAnonymous,
                        ProfileId = h.ProfileId,
                        SurveyId = h.SurveyId
                    }
            );
            if (profileSurveyDTOs == null || profileSurveyDTOs.Count() < 1)
            {
                profileSurveyDTOs = new List<ProfileSurveyDTO>();
            }
            return profileSurveyDTOs;
        }
        catch (System.Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<IEnumerable<ProfileSurveyDTO>> GetAllByProfileId(
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
            var profileSurveys = await _profileSurveyRepository.GetAllByProfileId(profileId);
            var profileSurveyDTOs = profileSurveys.Select(
                h =>
                    new ProfileSurveyDTO()
                    {
                        Id = h.Id,
                        Date = h.Date,
                        Rating = h.Rating,
                        IsAnonymous = h.IsAnonymous,
                        ProfileId = h.ProfileId,
                        SurveyId = h.SurveyId
                    }
            );
            if (profileSurveyDTOs == null || profileSurveyDTOs.Count() < 1)
            {
                profileSurveyDTOs = new List<ProfileSurveyDTO>();
            }
            return profileSurveyDTOs;
        }
        catch (System.Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ProfileSurveyDTO> GetByIdAsync(string id)
    {
        try
        {
            //villkor?
            var profileSurvey = await _profileSurveyRepository.GetByIdAsync(id);
            return new ProfileSurveyDTO()
            {
                Id = profileSurvey.Id,
                Date = profileSurvey.Date,
                Rating = profileSurvey.Rating,
                IsAnonymous = profileSurvey.IsAnonymous,
                ProfileId = profileSurvey.ProfileId,
                SurveyId = profileSurvey.SurveyId
            };
        }
        catch (System.Exception e)
        {
            throw new(e.Message);
        }
    }

    public async Task<ProfileSurveyDTO> UpdateAsync(
        ProfileSurveyDTO profileSurvey,
        User loggedInUser
    )
    {
        try
        {
            var existingProfileHC = await _profileSurveyRepository.GetByIdAsync(profileSurvey.Id);
            var profile = await _profileRepository.GetByIdAsync(profileSurvey.ProfileId);
            if (profile.UserId != loggedInUser.Id)
            {
                throw new Exception("Only owner of result can update.");
            }
            var profileHCToUpdate = new ProfileToSurvey()
            {
                Id = profileSurvey.Id,
                Date = existingProfileHC.Date,
                Rating = profileSurvey.Rating,
                IsAnonymous = profileSurvey.IsAnonymous,
                ProfileId = existingProfileHC.ProfileId,
                SurveyId = existingProfileHC.SurveyId
            };
            var updatedProfileHC = await _profileSurveyRepository.UpdateAsync(profileHCToUpdate);
            return new ProfileSurveyDTO()
            {
                Id = updatedProfileHC.Id,
                Date = updatedProfileHC.Date,
                Rating = updatedProfileHC.Rating,
                IsAnonymous = updatedProfileHC.IsAnonymous,
                ProfileId = updatedProfileHC.ProfileId,
                SurveyId = updatedProfileHC.SurveyId
            };
        }
        catch (System.Exception e)
        {
            throw new(e.Message);
        }
    }
}
