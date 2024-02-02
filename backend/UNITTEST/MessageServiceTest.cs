using System;
using System.Threading.Tasks;
using core;
using Interfaces;
using Moq;
using Xunit;

public class MessageServiceTests
{
    [Fact]
    public async Task CreateMessageInConversation_ValidParticipant_SimpleTest()
    {
        // Arrange
        var conversationRepositoryMock = new Mock<IConversationRepository>();
        var messageRepositoryMock = new Mock<IMessageRepository>();
        var conversationParticipantRepositoryMock = new Mock<IConversationParticipantRepository>();

        var messageService = new MessageService(
            conversationRepositoryMock.Object,
            messageRepositoryMock.Object,
            conversationParticipantRepositoryMock.Object
        );

        var incomingMessageDTO = new IncomingMessageDTO
        {
            ConversationParticipantId = "participantId123",
            Content = "Hello, this is a test message."
        };

        var loggedInUserId = "userId123";

        var conversationParticipant = new ConversationParticipant
        {
            Id = "participantId123",
            Profile = new Profile { UserId = loggedInUserId } 
        };

        conversationParticipantRepositoryMock.Setup(repo => repo.GetConversationById(It.IsAny<string>()))
            .ReturnsAsync(conversationParticipant);

        messageRepositoryMock.Setup(repo => repo.CreateAsync(It.IsAny<Message>()))
            .ReturnsAsync((Message newMessage) => newMessage);

  
        var createdMessage = await messageService.CreateMessageInConversation(incomingMessageDTO, loggedInUserId);

       
        Assert.NotNull(createdMessage);
        Assert.Equal(incomingMessageDTO.Content, createdMessage.Content);
    }
}



