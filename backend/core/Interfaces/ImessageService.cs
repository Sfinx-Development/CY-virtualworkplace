using core;

namespace Interfaces
{
    public interface IMessageService
    {
        Task<Message> CreateMessageInConversation(
            IncomingMessageDTO incomingMessageDTO,
            string loggedInUserId
        );
        Task DeleteAsync(string messageId, User loggedInUser);
        Task<Message> EditAsync(IncomingMessageDTO incomingMessageDTO, User loggedInUser);
    }
}
