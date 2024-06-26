using Interfaces;
using Microsoft.EntityFrameworkCore;

namespace core;

public class MessageRepository : IMessageRepository
{
    private readonly CyDbContext _cyDbContext;

    public MessageRepository(CyDbContext cyDbContext)
    {
        _cyDbContext = cyDbContext;
    }

    public async Task<Message> CreateAsync(Message message)
    {
        try
        {
            await _cyDbContext.Messages.AddAsync(message);
            await _cyDbContext.SaveChangesAsync();

            return message;
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task<List<Message>> GetAllMessagesInConversation(string conversationParticipantId)
    {
        try
        {
            var messages = await _cyDbContext
                .Messages.Where(m => m.ConversationParticipantId == conversationParticipantId)
                .ToListAsync();

            return messages;
        }
        catch (Exception)
        {
            throw new Exception("Failed to retrieve messages in conversation.");
        }
    }

    public async Task<Message> GetByIdAsync(string messageId)
    {
        try
        {
            Message message = await _cyDbContext
                .Messages.Include(m => m.ConversationParticipant)
                .ThenInclude(c => c.Profile)
                .FirstAsync(m => m.Id == messageId);
            if (message != null)
            {
                return message;
            }
            else
            {
                throw new Exception("No message found");
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task DeleteByIdAsync(string id)
    {
        try
        {
            var messageToDelete = await _cyDbContext.Messages.FindAsync(id);
            var deletedMessage = messageToDelete;
            if (messageToDelete != null)
            {
                _cyDbContext.Messages.Remove(messageToDelete);
                await _cyDbContext.SaveChangesAsync();
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<Message> Edit(Message message)
    {
        try
        {
            var messageToUpdate = await _cyDbContext.Messages.FirstAsync(m => m.Id == message.Id);

            if (messageToUpdate == null)
            {
                throw new Exception();
            }

            messageToUpdate.Content = message.Content ?? messageToUpdate.Content;

            _cyDbContext.Messages.Update(messageToUpdate);

            await _cyDbContext.SaveChangesAsync();
            return messageToUpdate;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}
