using Interfaces;
using Microsoft.EntityFrameworkCore;

namespace core;

public class ConversationParticipantRepository : IConversationParticipantRepository
{
     private readonly CyDbContext _cyDbContext;

    public ConversationParticipantRepository(CyDbContext cyDbContext)
    {
        _cyDbContext = cyDbContext;
    }

 public async Task<ConversationParticipant> Create(ConversationParticipant conversationParticipant)
    {
      try
        {
            await _cyDbContext.ConversationParticipants.AddAsync(conversationParticipant);
            await _cyDbContext.SaveChangesAsync();

            return conversationParticipant;
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }
//     public async Task<Conversation> Update(Conversation conversation)
//     {
//          try
//         {
//             var conversationToUpdate = await _cyDbContext.Conversations.FirstAsync(c => c.Id == conversation.Id);

//             if (conversationToUpdate == null)
//             {
//                 throw new Exception();
//             }

//             conversationToUpdate.Messages = conversation.Messages ?? conversationToUpdate.Messages;
//             conversationToUpdate.Participants = conversation.Participants ?? conversationToUpdate.Participants;
           

//             _cyDbContext.Conversations.Update(conversationToUpdate);

//             await _cyDbContext.SaveChangesAsync();
//             return conversationToUpdate;
//         }
//         catch (Exception e)
//         {
//             throw new Exception();
//         }
//     }
public async Task <List<ConversationParticipant>> GetAllByConversation(string conversationId)
{
    try{
        var conversationParticipant = await _cyDbContext
            .ConversationParticipants.Include(c => c.Messages).Where(c => c.ConversationId == conversationId)
           .ToListAsync();
           return conversationParticipant;
    }
    catch{
           throw new Exception();
    }
}

  public async Task<ConversationParticipant> GetConversationById(string conversationParticipantId)
{
    try
    {
        ConversationParticipant conversationParticipant = await _cyDbContext
            .ConversationParticipants
            .Include(c => c.Profile)  
            .Where(c => c.Id == conversationParticipantId)
            .FirstAsync();

        if (conversationParticipant == null)
        {
            throw new Exception("HITTADE INTE PARTICIPANT");
        }
        else
        {
            return conversationParticipant;
        }
    }
    catch (Exception e)
    {
        throw new Exception();
    }
}

//       public async Task DeleteConversationByIdAsync(string id)
//     {
//         try
//         {
//             var conversationToDelete = await _cyDbContext.Conversations.FindAsync(id);
//             if (conversationToDelete != null)
//             {
//                 _cyDbContext.Conversations.Remove(conversationToDelete);
//                 await _cyDbContext.SaveChangesAsync();
//             }
//         }
//         catch (Exception e)
//         {
//             throw new Exception(e.Message);
//         }
//     }

//         public async Task AddParticipantToConversationAsync(string conversationId, ConversationParticipant participant)
//         {
//             var conversation = await _dbContext.Conversations.Include(c => c.Participants).FirstOrDefaultAsync(c => c.Id == conversationId);
//             if (conversation != null)
//             {
//                 conversation.Participants.Add(participant);
//                 await _dbContext.SaveChangesAsync();
//             }
//         }

//         public async Task RemoveParticipantFromConversationAsync(string conversationId, string profileId)
//         {
//             var conversation = await _dbContext.Conversations.Include(c => c.Participants).FirstOrDefaultAsync(c => c.Id == conversationId);
//             if (conversation != null)
//             {
//                 var participantToRemove = conversation.Participants.Find(p => p.ProfileId == profileId);
//                 if (participantToRemove != null)
//                 {
//                     conversation.Participants.Remove(participantToRemove);
//                     await _dbContext.SaveChangesAsync();
//                 }
//             }
//         }

//         public async Task<List<ConversationParticipant>> GetParticipantsByConversationId(string conversationId)
//         {
//             var conversation = await _dbContext.Conversations.Include(c => c.Participants).FirstOrDefaultAsync(c => c.Id == conversationId);
//             return conversation?.Participants;
//         }
    }