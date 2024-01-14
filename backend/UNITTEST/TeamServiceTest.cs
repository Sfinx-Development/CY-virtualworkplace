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

    var ownerId = "owner123";
    var teamId = "team123";

    var owner = new User
    {
        Id = ownerId,
        FirstName = "Owner",
        LastName = "User"
    };

    var team = new Team
    {
        Id = teamId,
        Name = "Test Team"
    };

    team.Profiles = new List<Profile>
    {
        new Profile
        {
            Id = "ownerProfile123",
            Role = "Team Owner",
            IsOwner = true,
            DateCreated = DateTime.UtcNow,
            Team = team,
            User = owner
        }
      
    };

    userRepositoryMock.Setup(repo => repo.GetByIdAsync(ownerId))
        .ReturnsAsync(owner);

    teamRepositoryMock.Setup(repo => repo.GetByIdAsync(teamId))
        .ReturnsAsync(team);

   teamRepositoryMock.Setup(repo => repo.DeleteByIdAsync(It.IsAny<string>()))
    .Returns(Task.CompletedTask);


  
    var canDelete = await teamService.CanDeleteTeam(ownerId, teamId);

    
    Assert.True(canDelete);

   
    teamRepositoryMock.Verify(repo => repo.DeleteByIdAsync(teamId), Times.Once);
}

}



