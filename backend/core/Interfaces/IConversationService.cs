using core;

namespace Interfaces;

public interface IConversation
{
    Task<Conversation> CreateAsync(Conversation conversation);
    // Task<Conversation> UpdateAsync(Conversation conversation);
    // Task<Conversation> GetByIdAsync(string id);
    // Task DeleteByIdAsync(string id);

}