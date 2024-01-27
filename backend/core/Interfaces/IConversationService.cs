using core;

namespace Interfaces;

public interface IConversationService
{
    
     Task<Conversation> CreateConversationAsync(string creatorUserId, string teamId);
     Task<List<Message>> GetConversationWithAllMessages(string conversationParticipantId, User user);
    // Task<Conversation> UpdateAsync(Conversation conversation);
    // Task<Conversation> GetByIdAsync(string id);
    // Task DeleteByIdAsync(string id);

}