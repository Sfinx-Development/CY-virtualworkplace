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
        var conversationServiceMock = new Mock<IConversationService>();
        var profileServiceMock = new Mock<IProfileService>();
        var meetingOccasionServiceMock = new Mock<IMeetingOccasionService>();

        var teamService = new TeamService(
            profileRepositoryMock.Object,
            teamRepositoryMock.Object,
            conversationServiceMock.Object,
            profileServiceMock.Object,
            meetingOccasionServiceMock.Object,
            userRepositoryMock.Object
        );

        var user = new User
        {
            Id = "userId123",
            FirstName = "Owner",
            LastName = "User"
        };

        var team = new Team { Id = "teamId123", Name = "Test Team" };

        var profile = new Profile
        {
            Id = "ownerProfile123",
            Role = "Team Owner",
            IsOwner = true,
            DateCreated = DateTime.UtcNow,
            Team = team,
            User = user
        };

        userRepositoryMock.Setup(repo => repo.GetByIdAsync(user.Id)).ReturnsAsync(user);

        profileRepositoryMock.Setup(repo => repo.GetByIdAsync(profile.Id)).ReturnsAsync(profile);

        teamRepositoryMock.Setup(repo => repo.GetByIdAsync(team.Id)).ReturnsAsync(team);

        var canDelete = await teamService.CanDeleteTeam(profile.Id, team.Id);

        Assert.True(canDelete);
    }

    [Fact]
    public async Task Owner_CannotLeaveTeam()
    {
        var profileRepositoryMock = new Mock<IProfileRepository>();
        var userRepositoryMock = new Mock<IUserRepository>();
        var teamRepositoryMock = new Mock<ITeamRepository>();
        var conversationServiceMock = new Mock<IConversationService>();

        var profileService = new ProfileService(
            profileRepositoryMock.Object,
            userRepositoryMock.Object,
            teamRepositoryMock.Object,
            conversationServiceMock.Object
        );

        var user = new User
        {
            Id = "userId123",
            FirstName = "Owner",
            LastName = "User"
        };

        var team = new Team { Id = "teamId123", Name = "Test Team" };

        var profile = new Profile
        {
            Id = "ownerProfile123",
            Role = "Team Owner",
            IsOwner = true,
            DateCreated = DateTime.UtcNow,
            Team = team,
            User = user
        };

        userRepositoryMock.Setup(repo => repo.GetByIdAsync(user.Id)).ReturnsAsync(user);

        profileRepositoryMock.Setup(repo => repo.GetByIdAsync(profile.Id)).ReturnsAsync(profile);

        teamRepositoryMock.Setup(repo => repo.GetByIdAsync(team.Id)).ReturnsAsync(team);

        await Assert.ThrowsAsync<Exception>(
            async () => await profileService.CantLeaveTeamIfOwner(profile)
        );
    }

    [Fact]
    public async Task DeleteTeam_DeletesAllProfilesForTeam()
    {
        var userRepositoryMock = new Mock<IUserRepository>();
        var teamRepositoryMock = new Mock<ITeamRepository>();
        var profileRepositoryMock = new Mock<IProfileRepository>();
        var userServiceMock = new Mock<IUserService>();
        var conversationServiceMock = new Mock<IConversationService>();
        var profileServiceMock = new Mock<IProfileService>();
        var meetingOccasionServiceMock = new Mock<IMeetingOccasionService>();

        var profileService = new ProfileService(
            profileRepositoryMock.Object,
            userRepositoryMock.Object,
            teamRepositoryMock.Object,
            conversationServiceMock.Object
        );
        var teamService = new TeamService(
            profileRepositoryMock.Object,
            teamRepositoryMock.Object,
            conversationServiceMock.Object,
            profileServiceMock.Object,
            meetingOccasionServiceMock.Object,
            userRepositoryMock.Object
        );

        var user = new User
        {
            Id = "userId123",
            FirstName = "Owner",
            LastName = "User"
        };

        var team = new Team { Id = "teamId123", Name = "Test Team" };

        teamRepositoryMock.Setup(repo => repo.GetByIdAsync(team.Id)).ReturnsAsync(team);

        profileRepositoryMock
            .Setup(repo => repo.GetProfilesInTeamAsync(team.Id))
            .ReturnsAsync(
                new List<Profile>
                {
                    new Profile { Id = "profileId1", Team = team, },
                    new Profile { Id = "profileId2", Team = team, }
                }
            );

        Console.WriteLine("Before calling DeleteTeamAndProfiles");

        teamRepositoryMock.Verify(repo => repo.DeleteByIdAsync(It.IsAny<string>()), Times.Never); // Teamet ska inte raderas direkt

        profileRepositoryMock
            .Setup(repo => repo.DeleteByIdAsync(It.IsAny<string>()))
            .Callback<string>(id => Console.WriteLine($"Deleting profile with Id: {id}"))
            .Returns(Task.CompletedTask);

        profileRepositoryMock.Verify(repo => repo.DeleteByIdAsync("profileId1"), Times.Never); // Radera specifik profil
        profileRepositoryMock.Verify(repo => repo.DeleteByIdAsync("profileId2"), Times.Never);

        await Assert.ThrowsAsync<Exception>(
            () => profileService.DeleteTeamAndProfiles(team.Id, user)
        );

        teamRepositoryMock.Verify(repo => repo.DeleteByIdAsync(team.Id), Times.Never);

        Console.WriteLine("After calling DeleteTeamAndProfiles");
    }
}
