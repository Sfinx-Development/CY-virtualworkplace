using System;
using System.Threading.Tasks;
using core;
using Interfaces;
using Moq;
using Xunit;

public class TeamServiceTests
{
    [Fact]
    public async Task DeleteTeam_OnlyOwnerCanDelete()
    {
        var userRepositoryMock = new Mock<IUserRepository>();
        var teamRepositoryMock = new Mock<ITeamRepository>();
        var profileRepositoryMock = new Mock<IProfileRepository>();
        var userServiceMock = new Mock<IUserService>();

        var teamService = new TeamService(profileRepositoryMock.Object, teamRepositoryMock.Object);

        var user = new User
        {
            Id = "userId123",
            FirstName = "Owner",
            LastName = "User"
        };

        var team = new Team
        {
            Id = "teamId123",
            Name = "Test Team"
        };

        var profile = new Profile
        {
            Id = "ownerProfile123",
            Role = "Team Owner",
            IsOwner = true,
            DateCreated = DateTime.UtcNow,
            Team = team,
            User = user
        };

        userRepositoryMock.Setup(repo => repo.GetByIdAsync(user.Id))
            .ReturnsAsync(user);

        profileRepositoryMock.Setup(repo => repo.GetByIdAsync(profile.Id))
              .ReturnsAsync(profile);

        teamRepositoryMock.Setup(repo => repo.GetByIdAsync(team.Id))
            .ReturnsAsync(team);


        var canDelete = await teamService.CanDeleteTeam(profile.Id, team.Id);


        Assert.True(canDelete);

    }
}



