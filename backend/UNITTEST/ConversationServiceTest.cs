using System;
using System.Threading.Tasks;
using core;
using Interfaces;
using Moq;
using Xunit;

public class ConversationServiceTests
{
  [Fact]
    public async Task CreateTeamConversationAsync_SimpleTest()
    {
        var teamRepositoryMock = new Mock<ITeamRepository>();
        var profileRepositoryMock = new Mock<IProfileRepository>();
        var conversationRepositoryMock = new Mock<IConversationRepository>();
        var conversationParticipantRepositoryMock = new Mock<IConversationParticipantRepository>();
        var messageRepositoryMock = new Mock<IMessageRepository>();

        var profile = new Profile
        {
            Id = "ownerProfile123",
            Role = "Team Owner",
            IsOwner = true,
            DateCreated = DateTime.UtcNow,
            Team = new Team { Id = "teamId123", Name = "Test Team" },
            User = new User { Id = "userId123", FirstName = "Owner", LastName = "User" }
        };

        teamRepositoryMock.Setup(repo => repo.GetByIdAsync(profile.Team.Id)).ReturnsAsync(profile.Team);
        profileRepositoryMock.Setup(repo => repo.GetByIdAsync(profile.Id)).ReturnsAsync(profile);

        conversationRepositoryMock
            .Setup(repo => repo.Create(It.IsAny<Conversation>()))
            .ReturnsAsync((Conversation conversation) => conversation);

        var conversationService = new ConversationService(
            conversationRepositoryMock.Object,
            profileRepositoryMock.Object,
            teamRepositoryMock.Object,
            conversationParticipantRepositoryMock.Object,
            messageRepositoryMock.Object
        );

    
        var createdConversation = await conversationService.CreateTeamConversationAsync(profile.Id, profile.Team.Id);

     
        Assert.NotNull(createdConversation);
        Assert.Equal(profile.Id, createdConversation.CreatorId);
    }

}







   

