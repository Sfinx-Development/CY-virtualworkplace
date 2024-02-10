using core;

namespace Interfaces;

public interface IConversationService
{
    Task<Conversation> CreateTeamConversationAsync(string creatorUserId, string teamId);
    Task<List<Message>> GetConversationWithAllMessages(string conversationParticipantId, User user);
    Task<ConversationParticipant> AddAutomaticProfileToConversationAsync(
        string profileId,
        Team team
    );
    Task<ConversationParticipant> ManualAddProfileToConversationAsync(
        string conversationParticipantId,
        string profileId
    );
    Task<ConversationParticipant> AddParticipantToTeamConversation(Profile profile, string teamId);
    Task<Conversation> GetTeamConversationWithAllMessages(string teamId, User loggedInUser);
    Task<ConversationParticipant> GetConversationParticipant(
        string conversationId,
        string profileId,
        User user
    );

    // Task<Conversation> UpdateAsync(Conversation conversation);
    // Task<Conversation> GetByIdAsync(string id);
    // Task DeleteByIdAsync(string id);
}
