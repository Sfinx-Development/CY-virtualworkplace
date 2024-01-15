using Interfaces;
using Microsoft.EntityFrameworkCore;

namespace core;

public class ConversationRepository : IConversationRepository
{

     private readonly CyDbContext _cyDbContext;

    public ConversationRepository(CyDbContext cyDbContext)
    {
        _cyDbContext = cyDbContext;
    }

 public async Task<Conversation> Create(Conversation conversation)
    {
      try
        {
            await _cyDbContext.Conversations.AddAsync(conversation);
            await _cyDbContext.SaveChangesAsync();

            return conversation;
        }
        catch (Exception e)
        {
            throw new Exception();
        }
    }
    public async Task<Conversation> Update(Conversation conversation)
    {
         try
        {
            var conversationToUpdate = await _cyDbContext.Conversations.FirstAsync(c => c.Id == conversation.Id);

            if (conversationToUpdate == null)
            {
                throw new Exception();
            }

            conversationToUpdate.Messages = conversation.Messages ?? conversationToUpdate.Messages;
            conversationToUpdate.Participants = conversation.Participants ?? conversationToUpdate.Participants;
           

            _cyDbContext.Conversations.Update(conversationToUpdate);

            await _cyDbContext.SaveChangesAsync();
            return conversationToUpdate;
        }
        catch (Exception e)
        {
            throw new Exception();
        }
    }

    public async Task<Conversation> GetConversationById(string id)
    {
        try
        {
            Conversation conversation = await _cyDbContext
                .Conversations.Include(c => c.Participants)
                .Where(c => c.Id == id)
                .FirstAsync();

            if (conversation == null)
            {
                throw new Exception();
            }
            else
            {
                return conversation;
            }
        }
        catch (Exception e)
        {
            throw new Exception();
        }
    }
      public async Task DeleteConversationByIdAsync(string id)
    {
        try
        {
            var conversationToDelete = await _cyDbContext.Conversations.FindAsync(id);
            if (conversationToDelete != null)
            {
                _cyDbContext.Conversations.Remove(conversationToDelete);
                await _cyDbContext.SaveChangesAsync();
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}