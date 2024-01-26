using core;

namespace Interfaces
{
    public interface IMessageService
    {
        Task<Message> CreateMessageInConversation(IncomingMessageDTO incomingMessageDTO, string loggedInUserId);
        // List<Message> GetAll(Conversation conversation, User user);
        // Task RemoveConversationAndMessages(Conversation conversation, Message messages);
    }
}
