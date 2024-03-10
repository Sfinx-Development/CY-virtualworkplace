using System;
using System.Threading.Tasks;
using core;
using Interfaces;
using Moq;
using Moq.Protected;
using Xunit;

public class HealthCheckServiceTests
{
    [Fact]
    public async Task CreateHealthCheck_ShouldNotWork_IfStartTimeNotInFuture()
    {
        // Arrange

        var profileRepositoryMock = new Mock<IProfileRepository>();
        var teamRepositoryMock = new Mock<ITeamRepository>();
        var healthCheckRepositoryMock = new Mock<IHealthCheckRepository>();
        var profileHealthCheckRepositoryMock = new Mock<IProfileHealthCheckRepository>();

        var healthCheckService = new HealthCheckService(
            profileRepositoryMock.Object,
            healthCheckRepositoryMock.Object,
            teamRepositoryMock.Object,
            profileHealthCheckRepositoryMock.Object
        );

        var now = DateTime.UtcNow;
        var yesterday = now.AddDays(-1);

        var healthCheckDTO = new HealthCheckDTO
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
            () => healthCheckService.CreateHealthCheckAsync(healthCheckDTO, loggedInUser)
        );
    }

    [Fact]
    public async Task DeleteHealthCheck_ShouldRemove_AllProfileHealthCheck_WithHealthCheckId()
    {
        // Arrange

        var profileRepositoryMock = new Mock<IProfileRepository>();
        var teamRepositoryMock = new Mock<ITeamRepository>();
        var healthCheckRepositoryMock = new Mock<IHealthCheckRepository>();
        var profileHealthCheckRepositoryMock = new Mock<IProfileHealthCheckRepository>();

        var healthCheckService = new HealthCheckService(
            profileRepositoryMock.Object,
            healthCheckRepositoryMock.Object,
            teamRepositoryMock.Object,
            profileHealthCheckRepositoryMock.Object
        );

        var tomorrow = DateTime.UtcNow.AddDays(1);
        var nextWeek = tomorrow.AddDays(7);

        var healthCheck = new HealthCheck
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

        var listOfProfileHC = new List<ProfileHealthCheck>();
        var profileHealthCheck = new ProfileHealthCheck() { Id = "PHC123", HealthCheckId = "123" };
        listOfProfileHC.Add(profileHealthCheck);

        healthCheckRepositoryMock
            .Setup(repo => repo.GetByIdAsync(It.IsAny<string>()))
            .ReturnsAsync(healthCheck);

        profileRepositoryMock
            .Setup(repo => repo.GetByUserAndTeamIdAsync(It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync(profile);

        profileHealthCheckRepositoryMock
            .Setup(repo => repo.GetAllByHealthCheck(healthCheck.Id))
            .ReturnsAsync(listOfProfileHC);

        await healthCheckService.DeleteById(healthCheck.Id, loggedInUser);

        profileHealthCheckRepositoryMock.Verify(
            repo => repo.DeleteByIdAsync(It.IsAny<string>()),
            Times.Exactly(1)
        );
    }
}
