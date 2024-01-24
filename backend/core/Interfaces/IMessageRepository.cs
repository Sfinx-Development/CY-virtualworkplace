using core;

namespace Interfaces;

public interface IMessageRepository
{
    Task<Message> CreateAsync(Message message);
    // Task<Message> GetByIdAsync(string messageId);
    // Task<List<Message>> GetAllOccasionsByMeetingId(string id);
    // Task DeleteByIdAsync(string id);
    // Task<Message> UpdateAsync(Message message);

}