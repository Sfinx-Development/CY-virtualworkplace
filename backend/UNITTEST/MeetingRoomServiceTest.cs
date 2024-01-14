using System;
using core;
using Interfaces;
using Moq;
using Xunit;

public class MeetingroomServiceTest
{
    [Fact]
    public async Task MeetingRoomWithTeamIdCreatesWhenTeamCreates()
    {
        // mocka
        var teamRepositoryMock = new Mock<ITeamRepository>();
        var profileRepositoryMock = new Mock<IProfileRepository>();
        var meetingRoomServiceMock = new Mock<IMeetingRoomService>();

        // bestäm vad createasync ska returnera sen
        teamRepositoryMock
            .Setup(repo => repo.CreateAsync(It.IsAny<Team>()))
            .ReturnsAsync(
                (Team team) =>
                {
                    team.Id = "123";
                    return team;
                }
            );

        meetingRoomServiceMock
            .Setup(service => service.CreateMeetingRoom(It.IsAny<Team>()))
            .ReturnsAsync(
                (Team team) =>
                {
                    var meetingRoom = new MeetingRoom { TeamId = team.Id };
                    return meetingRoom;
                }
            );

        var teamService = new TeamService(
            profileRepositoryMock.Object,
            teamRepositoryMock.Object,
            meetingRoomServiceMock.Object
        );

        var createTeamDTO = new IncomingCreateTeamDTO
        {
            TeamName = "TestTeam",
            TeamRole = "TestRole"
        };

        var createdTeam = await teamService.CreateAsync(createTeamDTO);

        Assert.NotNull(createdTeam);

        meetingRoomServiceMock.Verify(
            service => service.CreateMeetingRoom(It.Is<Team>(t => t.Id == createdTeam.Id)),
            Times.Once
        );
    }

    [Fact]
    public void GetUserById_ExistingUserId_ReturnsUser()
    {
        var userRepositoryMock = new Mock<IUserRepository>();
        userRepositoryMock
            .Setup(repo => repo.GetByIdAsync("123"))
            .ReturnsAsync(
                new User
                {
                    Id = "123",
                    FirstName = "Angelina",
                    LastName = "Holmqvist"
                }
            );

        var userService = new UserService(userRepositoryMock.Object);

        var user = userService.GetById("123");

        Assert.NotNull(user);
    }
}
