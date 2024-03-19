using core;

public interface IConversationParticipantService
{
    public Task<ConversationParticipant> Update(
        ConversationParticipantDTO conversationParticipantDTO
    );
}
