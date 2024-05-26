using System;
using System.Threading.Tasks;
using core;
using Interfaces;
using Moq;
using Xunit;

public class ProjectServiceTest
{
    [Fact]
    public async Task DeletingProject_Should_Delete_ProjectUpdates()
    {
        var profileRepositoryMock = new Mock<IProfileRepository>();
        var projectRepositoryMock = new Mock<IProjectRepository>();
        var projectUpdateRepositoryMock = new Mock<IProjectUpdateRepository>();
        var updateCommentRepositoryMock = new Mock<IUpdateCommentRepository>();
        var teamRepositoryMock = new Mock<ITeamRepository>();

        var projectService = new ProjectService(
            profileRepositoryMock.Object,
            projectRepositoryMock.Object
        );

        var projectUpdateService = new ProjectUpdateService(
            projectUpdateRepositoryMock.Object,
            projectRepositoryMock.Object,
            profileRepositoryMock.Object,
            teamRepositoryMock.Object,
            updateCommentRepositoryMock.Object
        );

        var project = new Project { Id = "123", TeamId = "456" };
        var projectUpdate = new ProjectUpdate
        {
            Id = "777",
            ProjectId = "123",
            Project = project
        };
        var user = new User { Id = "789" };
        var profile = new Profile
        {
            Id = "000",
            TeamId = "456",
            UserId = user.Id
        };

        projectRepositoryMock.Setup(repo => repo.GetByIdAsync(project.Id)).ReturnsAsync(project);
        profileRepositoryMock
            .Setup(repo => repo.GetByUserAndTeamIdAsync(user.Id, project.TeamId))
            .ReturnsAsync(profile);

        await projectService.DeleteById(project.Id, user);
        var projectUpdateFound = await projectUpdateService.GetByIdAsync(projectUpdate.Id);
        Assert.Null(projectUpdateFound);
    }
}
