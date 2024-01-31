// using System;
// using core;
// using Interfaces;
// using Moq;
// using Xunit;

// public class MeetingroomServiceTest
// {
//     [Fact]
//     public async Task MeetingRoomWithTeamIdCreatesWhenTeamCreates()
//     {
//         // mocka
//         var teamRepositoryMock = new Mock<ITeamRepository>();
//         var profileRepositoryMock = new Mock<IProfileRepository>();
//         var meetingRoomServiceMock = new Mock<IMeetingRoomService>();
//              var conversationServiceMock = new Mock<IConversationService>();
//         var profileServiceMock = new Mock<IProfileService>();

//         // bestäm vad createasync ska returnera sen
//         teamRepositoryMock
//             .Setup(repo => repo.CreateAsync(It.IsAny<Team>()))
//             .ReturnsAsync(
//                 (Team team) =>
//                 {
//                     team.Id = "123";
//                     return team;
//                 }
//             );

//         meetingRoomServiceMock
//             .Setup(service => service.CreateMeetingRoom(It.IsAny<Team>()))
//             .ReturnsAsync(
//                 (Team team) =>
//                 {
//                     var meetingRoom = new MeetingRoom { TeamId = team.Id };
//                     return meetingRoom;
//                 }
//             );

//         var teamService = new TeamService(
//             profileRepositoryMock.Object,
//             teamRepositoryMock.Object,
//             meetingRoomServiceMock.Object,
//             conversationServiceMock.Object,
//             profileServiceMock.Object
//         );

//         var createTeamDTO = new IncomingCreateTeamDTO
//         {
//             TeamName = "TestTeam",
//             TeamRole = "TestRole"
//         };

//         var user = new User{
//             Id = "123"
//         };

//         var createdTeam = await teamService.CreateAsync(createTeamDTO, user);

//         Assert.NotNull(createdTeam);

//         meetingRoomServiceMock.Verify(
//             service => service.CreateMeetingRoom(It.Is<Team>(t => t.Id == createdTeam.Id)),
//             Times.Once
//         );
//     }
// }
