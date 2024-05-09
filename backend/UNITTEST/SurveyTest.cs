using System;
using System.Threading.Tasks;
using core;
using Interfaces;
using Moq;
using Moq.Protected;
using Xunit;

public class SurveyServiceTests
{
    [Fact]
    public async Task CreateSurvey_ShouldNotWork_IfStartTimeNotInFuture()
    {
        // Arrange

        var profileRepositoryMock = new Mock<IProfileRepository>();
        var teamRepositoryMock = new Mock<ITeamRepository>();
        var surveyRepositoryMock = new Mock<ISurveyRepository>();
        var profileSurveyRepositoryMock = new Mock<IProfileSurveyRepository>();

        var surveyService = new SurveyService(
            profileRepositoryMock.Object,
            surveyRepositoryMock.Object,
            teamRepositoryMock.Object,
            profileSurveyRepositoryMock.Object
        );

        var now = DateTime.UtcNow;
        var yesterday = now.AddDays(-1);

        var surveyDTO = new SurveyDTO
        {
            Id = "123",
            Question = "En fråga?",
            StartTime = yesterday,
            EndTime = now,
            TeamId = "team123"
        };

        // var loggedInUserId = "userId123";
        var loggedInUser = new User { Id = "userId123" };

        var profile = new Profile
        {
            Id = "owner123",
            IsOwner = true,
            TeamId = "team123",
            UserId = "userId123"
        };

        profileRepositoryMock
            .Setup(repo => repo.GetByUserAndTeamIdAsync(It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync(profile);

        await Assert.ThrowsAsync<Exception>(
            () => surveyService.CreateSurveyAsync(surveyDTO, loggedInUser)
        );
    }

    [Fact]
    public async Task DeleteSurvey_ShouldRemove_AllProfileSurvey_WithSurveyId()
    {
        // Arrange

        var profileRepositoryMock = new Mock<IProfileRepository>();
        var teamRepositoryMock = new Mock<ITeamRepository>();
        var surveyRepositoryMock = new Mock<ISurveyRepository>();
        var profileSurveyRepositoryMock = new Mock<IProfileSurveyRepository>();

        var surveyService = new SurveyService(
            profileRepositoryMock.Object,
            surveyRepositoryMock.Object,
            teamRepositoryMock.Object,
            profileSurveyRepositoryMock.Object
        );

        var tomorrow = DateTime.UtcNow.AddDays(1);
        var nextWeek = tomorrow.AddDays(7);

        var survey = new Survey
        {
            Id = "123",
            Question = "En fråga?",
            StartTime = tomorrow,
            EndTime = nextWeek,
            TeamId = "team123"
        };

        var loggedInUser = new User { Id = "userId123" };

        var profile = new Profile
        {
            Id = "owner123",
            IsOwner = true,
            TeamId = "team123",
            UserId = "userId123"
        };

        var listOfProfileHC = new List<ProfileToSurvey>();
        var profileSurvey = new ProfileToSurvey() { Id = "PHC123", SurveyId = "123" };
        listOfProfileHC.Add(profileSurvey);

        surveyRepositoryMock
            .Setup(repo => repo.GetByIdAsync(It.IsAny<string>()))
            .ReturnsAsync(survey);

        profileRepositoryMock
            .Setup(repo => repo.GetByUserAndTeamIdAsync(It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync(profile);

        profileSurveyRepositoryMock
            .Setup(repo => repo.GetAllBySurvey(survey.Id))
            .ReturnsAsync(listOfProfileHC);

        await surveyService.DeleteById(survey.Id, loggedInUser);

        profileSurveyRepositoryMock.Verify(
            repo => repo.DeleteByIdAsync(It.IsAny<string>()),
            Times.Exactly(1)
        );
    }
}
