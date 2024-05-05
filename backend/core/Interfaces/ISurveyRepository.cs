namespace core;

public interface ISurveyRepository
{
    Task<Survey> CreateAsync(Survey survey);

    Task<Survey> GetByIdAsync(string id);

    Task<Survey> UpdateAsync(Survey survey);

    Task DeleteByIdAsync(string id);

    Task<List<Survey>> GetAllByTeam(string teamId);
}
