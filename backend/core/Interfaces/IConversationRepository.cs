using core;

namespace Interfaces;

public interface IConversationRepository
{
    Task<Conversation> Create(Conversation conversation);
    Task<Conversation> Update(Conversation conversation);
    Task<Conversation> GetConversationById(string id);
    Task DeleteConversationByIdAsync(string id);

}