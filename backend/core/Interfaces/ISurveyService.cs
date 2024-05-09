namespace core;

public interface ISurveyService
{
    Task<Survey> CreateSurveyAsync(SurveyDTO surveyDTO, User loggedInUser);

    Task<Survey> UpdateSurvey(SurveyDTO surveyDTO, User loggedInUser);

    Task<Survey> GetSurveyById(string id);
    Task<List<Survey>> GetByTeam(string profileId, User loggedInUser);
    Task DeleteById(string id, User loggedInUser);
}
