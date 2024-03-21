using System;
using Interfaces;

namespace core;

public class HealthCheckService : IHealthCheckService
{
    private readonly IProfileRepository _profileRepository;
    private readonly ITeamRepository _teamRepository;
    private readonly IHealthCheckRepository _healthCheckRepository;
    private readonly IProfileHealthCheckRepository _profileHealthCheckRepository;

    public HealthCheckService(
        IProfileRepository profileRepository,
        IHealthCheckRepository healthCheckRepository,
        ITeamRepository teamRepository,
        IProfileHealthCheckRepository profileHealthCheckRepository
    )
    {
        _profileRepository = profileRepository;
        _healthCheckRepository = healthCheckRepository;
        _teamRepository = teamRepository;
        _profileHealthCheckRepository = profileHealthCheckRepository;
    }

    public async Task<HealthCheck> CreateHealthCheckAsync(
        HealthCheckDTO healthCheck,
        User loggedInUser
    )
    {
        try
        {
            //kolla om den som begär är en del av teamet
            var profile = await _profileRepository.GetByUserAndTeamIdAsync(
                loggedInUser.Id,
                healthCheck.TeamId
            );

            var now = DateTime.UtcNow;
            if (healthCheck.StartTime < now)
            {
                throw new Exception("Can not create healthchecks for the past.");
            }
            HealthCheck newHealthCheck =
                new(
                    Utils.GenerateRandomId(),
                    healthCheck.TeamId,
                    healthCheck.Question,
                    healthCheck.StartTime,
                    healthCheck.EndTime
                );

            HealthCheck createdHealthCheck = await _healthCheckRepository.CreateAsync(
                newHealthCheck
            );

            return createdHealthCheck;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<HealthCheck> UpdateHealthCheck(HealthCheckDTO healthCheck, User loggedInUser)
    {
        try
        {
            var foundHealthCheck =
                await _healthCheckRepository.GetByIdAsync(healthCheck.Id) ?? throw new Exception();
            var profile = await _profileRepository.GetByUserAndTeamIdAsync(
                loggedInUser.Id,
                healthCheck.TeamId
            );

            if (!profile.IsOwner)
            {
                throw new Exception("Only owner of team can update healthcheck");
            }

            foundHealthCheck.Question = healthCheck.Question ?? foundHealthCheck.Question;
            foundHealthCheck.StartTime = healthCheck.StartTime;
            foundHealthCheck.EndTime = healthCheck.EndTime;

            var updatedHealthCheck = await _healthCheckRepository.UpdateAsync(foundHealthCheck);
            return updatedHealthCheck;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<HealthCheck> GetHealthCheckBykId(string id)
    {
        try
        {
            var healthCheck = await _healthCheckRepository.GetByIdAsync(id);

            if (healthCheck == null)
            {
                throw new Exception("HealthCheck can't be found");
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

    public async Task<List<HealthCheck>> GetByTeam(string profileId, User loggedInUser)
    {
        try
        {
            var profile = await _profileRepository.GetByIdAsync(profileId);
            if (profile.UserId != loggedInUser.Id)
            {
                throw new Exception("Not valid user");
            }
            // var now = new DateTime();
            var healthChecks = await _healthCheckRepository.GetAllByTeam(profile.TeamId);
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

    // public async Task DeleteHealthCheckAndProfileChecks(string HealthCheckId, string loggedInUserId)
    // {
    //     try
    //     {
    //         var HealthCheck = await _HealthCheckRepository.GetByIdAsync(HealthCheckId);
    //         var profile = await _profileRepository.GetByIdAsync(HealthCheck.OwnerId);
    //         if (profile.UserId == loggedInUserId)
    //         {
    //             //hämta alla HealthCheckoccasions för mötet och radera dom sen mötet
    //             var HealthCheckOccasions =
    //                 await _HealthCheckOccasionRepository.GetAllOccasionsByHealthCheckId(
    //                     HealthCheck.Id
    //                 );

    //             foreach (var mo in HealthCheckOccasions)
    //             {
    //                 await _HealthCheckOccasionRepository.DeleteByIdAsync(mo.Id);
    //             }

    //             await _HealthCheckRepository.DeleteByIdAsync(HealthCheck.Id);
    //         }
    //         else
    //         {
    //             throw new Exception("Only owner can delete HealthCheck");
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
            var profileHealthChecks = await _profileHealthCheckRepository.GetAllByHealthCheck(
                healthCheck.Id
            );
            foreach (var profileHC in profileHealthChecks)
            {
                await _profileHealthCheckRepository.DeleteByIdAsync(profileHC.Id);
            }
            await _healthCheckRepository.DeleteByIdAsync(id);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}
