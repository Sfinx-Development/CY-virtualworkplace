namespace core;

public interface IProfileSurveyRepository
{
    Task<ProfileToSurvey> CreateAsync(ProfileToSurvey profileToSurvey);

    Task<ProfileToSurvey> GetByIdAsync(string id);

    Task<ProfileToSurvey> UpdateAsync(ProfileToSurvey profileToSurvey);

    Task DeleteByIdAsync(string id);

    Task<IEnumerable<ProfileToSurvey>> GetAllBySurvey(string surveyId);
    Task<IEnumerable<ProfileToSurvey>> GetAllByProfileId(string profileId);
}
