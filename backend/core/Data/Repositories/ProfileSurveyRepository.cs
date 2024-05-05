using Microsoft.EntityFrameworkCore;

namespace core;

public class ProfileSurveyRepository : IProfileSurveyRepository
{
    private readonly CyDbContext _cyDbContext;

    public ProfileSurveyRepository(CyDbContext cyDbContext)
    {
        _cyDbContext = cyDbContext;
    }

    public async Task<ProfileToSurvey> CreateAsync(ProfileToSurvey profileToSurvey)
    {
        try
        {
            await _cyDbContext.ProfileToSurveys.AddAsync(profileToSurvey);
            await _cyDbContext.SaveChangesAsync();
            return profileToSurvey;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task DeleteByIdAsync(string id)
    {
        try
        {
            var foundProfileSurvey = await _cyDbContext.ProfileToSurveys.FindAsync(id);
            if (foundProfileSurvey != null)
            {
                _cyDbContext.ProfileToSurveys.Remove(foundProfileSurvey);
                await _cyDbContext.SaveChangesAsync();
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<IEnumerable<ProfileToSurvey>> GetAllBySurvey(string surveyId)
    {
        try
        {
            var profileSurveys = await _cyDbContext
                .ProfileToSurveys.Where(p => p.SurveyId == surveyId)
                .ToListAsync();
            return profileSurveys;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<IEnumerable<ProfileToSurvey>> GetAllByProfileId(string profileId)
    {
        try
        {
            var profileSurveys = await _cyDbContext
                .ProfileToSurveys.Where(p => p.ProfileId == profileId)
                .ToListAsync();
            return profileSurveys;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ProfileToSurvey> GetByIdAsync(string id)
    {
        try
        {
            var profileSurveys = await _cyDbContext
                .ProfileToSurveys.Where(p => p.Id == id)
                .FirstAsync();
            return profileSurveys;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ProfileToSurvey> UpdateAsync(ProfileToSurvey profileToSurvey)
    {
        try
        {
            _cyDbContext.ProfileToSurveys.Update(profileToSurvey);
            await _cyDbContext.SaveChangesAsync();
            return profileToSurvey;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}
