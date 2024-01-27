using core;

namespace Interfaces;

public interface IMessageRepository
{
    Task<Message> CreateAsync(Message message);
    Task<List<Message>> GetAllMessagesInConversation(string conversationParticipantId);
    // Task<Message> GetByIdAsync(string messageId);
    // Task<List<Message>> GetAllOccasionsByMeetingId(string id);
    // Task DeleteByIdAsync(string id);
    // Task<Message> UpdateAsync(Message message);

}