namespace core;

public interface IProfileSurveyService
{
    Task<ProfileSurveyDTO> CreateAsync(ProfileSurveyDTO profileSurveyDTO, User loggedInUser);

    Task<ProfileSurveyDTO> GetByIdAsync(string id);

    Task<ProfileSurveyDTO> UpdateAsync(ProfileSurveyDTO profileSurveyDTO, User loggedInUser);

    Task DeleteByIdAsync(string id, User loggedInUser);

    Task<IEnumerable<ProfileSurveyDTO>> GetAllBySurvey(
        string surveyId,
        User loggedInUser
    );

    Task<IEnumerable<ProfileSurveyDTO>> GetAllByProfileId(string profileId, User loggedInUser);
}
