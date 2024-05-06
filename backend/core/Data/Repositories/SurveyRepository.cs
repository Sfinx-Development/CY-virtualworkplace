using Interfaces;
using Microsoft.EntityFrameworkCore;

namespace core;

public class SurveyRepository : ISurveyRepository
{
    private readonly CyDbContext _cyDbContext;

    public SurveyRepository(CyDbContext cyDbContext)
    {
        _cyDbContext = cyDbContext;
    }

    public async Task<Survey> CreateAsync(Survey survey)
    {
        try
        {
            await _cyDbContext.Surveys.AddAsync(survey);
            await _cyDbContext.SaveChangesAsync();
            return survey;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<Survey> GetByIdAsync(string id)
    {
        try
        {
            Survey survey = await _cyDbContext
                .Surveys.Include(h => h.Team)
                .Where(m => m.Id == id)
                .FirstAsync();

            if (survey != null)
            {
                return survey;
            }
            else
            {
                throw new Exception("Survey not found.");
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<Survey> UpdateAsync(Survey survey)
    {
        try
        {
            _cyDbContext.Surveys.Update(survey);

            await _cyDbContext.SaveChangesAsync();
            return survey;
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
            var surveyToDelete = await _cyDbContext.Surveys.FindAsync(id);
            if (surveyToDelete != null)
            {
                var profileSurveys = await _cyDbContext
                    .ProfileToSurveys.Where(p => p.SurveyId == surveyToDelete.Id)
                    .ToListAsync();
                if (profileSurveys != null)
                {
                    _cyDbContext.ProfileToSurveys.RemoveRange(profileSurveys);
                }
                _cyDbContext.Surveys.Remove(surveyToDelete);
                await _cyDbContext.SaveChangesAsync();
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<List<Survey>> GetAllByTeam(string teamId)
    {
        try
        {
            var surveys = await _cyDbContext.Surveys.Where(m => m.TeamId == teamId).ToListAsync();
            return surveys;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}
