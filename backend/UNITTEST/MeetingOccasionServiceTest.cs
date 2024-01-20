using System;
using core;
using Interfaces;
using Moq;
using Xunit;

public class MeetingOccasionServiceTest
{
    [Fact]
    public async Task MeetingDateUpdatesWhenGettingOccasions()
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
}
