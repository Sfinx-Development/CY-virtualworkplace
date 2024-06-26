using core;

namespace Interfaces;

public interface IConversationRepository
{
    Task<Conversation> Create(Conversation conversation);
    // Task<Conversation> GetConversationOwnerAsync(string conversationId);
    
    Task<string> GetConversationByProfiles(Team team, string myId);
    Task<Conversation> GetConversationByTeamId(string teamId);
    
    
    // Task<Conversation> Update(Conversation conversation);
    // Task<Conversation> GetConversationById(string id);
    // Task DeleteConversationByIdAsync(string id);
    //   Task AddParticipantToConversationAsync(string conversationId, ConversationParticipant participant);
    //     Task RemoveParticipantFromConversationAsync(string conversationId, string profileId);

        
    //     Task<List<ConversationParticipant>> GetParticipantsByConversationId(string conversationId);

}