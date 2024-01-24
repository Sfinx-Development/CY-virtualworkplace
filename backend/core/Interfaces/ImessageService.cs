using core;

namespace Interfaces
{
    public interface IMessageService
    {
        Task<Message> Create(Message message);
        // List<Message> GetAll(Conversation conversation, User user);
        // Task RemoveConversationAndMessages(Conversation conversation, Message messages);
    }
}
