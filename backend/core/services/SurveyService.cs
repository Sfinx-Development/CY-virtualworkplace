using System;
using Interfaces;

namespace core;

public class SurveyService : ISurveyService
{
    private readonly IProfileRepository _profileRepository;
    private readonly ITeamRepository _teamRepository;
    private readonly ISurveyRepository _healthCheckRepository;
    private readonly IProfileSurveyRepository _profileSurveyRepository;

    public SurveyService(
        IProfileRepository profileRepository,
        ISurveyRepository healthCheckRepository,
        ITeamRepository teamRepository,
        IProfileSurveyRepository profileSurveyRepository
    )
    {
        _profileRepository = profileRepository;
        _healthCheckRepository = healthCheckRepository;
        _teamRepository = teamRepository;
        _profileSurveyRepository = profileSurveyRepository;
    }

    public async Task<Survey> CreateSurveyAsync(SurveyDTO healthCheck, User loggedInUser)
    {
        try
        {
            //kolla om den som begär är en del av teamet
            var profile = await _profileRepository.GetByUserAndTeamIdAsync(
                loggedInUser.Id,
                healthCheck.TeamId
            );

            var now = DateTime.UtcNow;
            if (healthCheck.EndTime < now)
            {
                throw new Exception("Can not create healthchecks for the past.");
            }
            Survey newSurvey =
                new(
                    Utils.GenerateRandomId(),
                    healthCheck.TeamId,
                    healthCheck.Question,
                    healthCheck.StartTime.AddHours(1),
                    healthCheck.EndTime.AddHours(1)
                );

            Survey createdSurvey = await _healthCheckRepository.CreateAsync(newSurvey);

            return createdSurvey;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<Survey> UpdateSurvey(SurveyDTO healthCheck, User loggedInUser)
    {
        try
        {
            var foundSurvey =
                await _healthCheckRepository.GetByIdAsync(healthCheck.Id) ?? throw new Exception();
            var profile = await _profileRepository.GetByUserAndTeamIdAsync(
                loggedInUser.Id,
                healthCheck.TeamId
            );

            if (!profile.IsOwner)
            {
                throw new Exception("Only owner of team can update healthcheck");
            }

            foundSurvey.Question = healthCheck.Question ?? foundSurvey.Question;
            foundSurvey.StartTime = healthCheck.StartTime;
            foundSurvey.EndTime = healthCheck.EndTime;

            var updatedSurvey = await _healthCheckRepository.UpdateAsync(foundSurvey);
            return updatedSurvey;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<Survey> GetSurveyById(string id)
    {
        try
        {
            var healthCheck = await _healthCheckRepository.GetByIdAsync(id);

            if (healthCheck == null)
            {
                throw new Exception("Survey can't be found");
            }
            else
            {
                return healthCheck;
            }
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task<List<Survey>> GetByTeam(string profileId, User loggedInUser)
    {
        try
        {
            var profile = await _profileRepository.GetByIdAsync(profileId);
            if (profile.UserId != loggedInUser.Id)
            {
                throw new Exception("Not valid user");
            }
            // var now = new DateTime();
            var healthChecks =
                await _healthCheckRepository.GetAllByTeam(profile.TeamId) ?? new List<Survey>();
            // var healthChecksValidNow = healthChecks.FindAll(
            //     h => h.StartTime >= now && h.EndTime < now
            // );
            return healthChecks;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    // public async Task DeleteSurveyAndProfileChecks(string SurveyId, string loggedInUserId)
    // {
    //     try
    //     {
    //         var Survey = await _SurveyRepository.GetByIdAsync(SurveyId);
    //         var profile = await _profileRepository.GetByIdAsync(Survey.OwnerId);
    //         if (profile.UserId == loggedInUserId)
    //         {
    //             //hämta alla Surveyoccasions för mötet och radera dom sen mötet
    //             var SurveyOccasions =
    //                 await _SurveyOccasionRepository.GetAllOccasionsBySurveyId(
    //                     Survey.Id
    //                 );

    //             foreach (var mo in SurveyOccasions)
    //             {
    //                 await _SurveyOccasionRepository.DeleteByIdAsync(mo.Id);
    //             }

    //             await _SurveyRepository.DeleteByIdAsync(Survey.Id);
    //         }
    //         else
    //         {
    //             throw new Exception("Only owner can delete Survey");
    //         }
    //     }
    //     catch (Exception)
    //     {
    //         throw new Exception();
    //     }
    // }

    public async Task DeleteById(string id, User loggedInUser)
    {
        try
        {
            //när denna raderas så ska alla profilers svar också raderas
            var healthCheck = await _healthCheckRepository.GetByIdAsync(id);
            var profile = await _profileRepository.GetByUserAndTeamIdAsync(
                loggedInUser.Id,
                healthCheck.TeamId
            );
            if (!profile.IsOwner)
            {
                throw new Exception("Only team owner can delete healthcheck.");
            }
            //kolla här så den som raderar är ägaren av teamet
            //hämta ut healthcheck sen matcha loggedinuser med ownerns userid
            var profileSurveys = await _profileSurveyRepository.GetAllBySurvey(healthCheck.Id);
            foreach (var profileHC in profileSurveys)
            {
                await _profileSurveyRepository.DeleteByIdAsync(profileHC.Id);
            }
            await _healthCheckRepository.DeleteByIdAsync(id);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}
