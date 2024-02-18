using core;

namespace Interfaces;

public interface IMessageRepository
{
    Task<Message> CreateAsync(Message message);
    Task<List<Message>> GetAllMessagesInConversation(string conversationParticipantId);
    Task<Message> GetByIdAsync(string messageId);
    Task DeleteByIdAsync(string id);
    Task<Message> Edit(Message message);
}
