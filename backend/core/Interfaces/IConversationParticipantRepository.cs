using Interfaces;
using Microsoft.EntityFrameworkCore;

namespace core;

public interface IConversationParticipantRepository
{
    Task<ConversationParticipant> Create(ConversationParticipant conversationPartisipant);
    public Task<ConversationParticipant> Update(ConversationParticipant conversationParticipant);
    Task<ConversationParticipant> GetConversationParticipantById(string conversationParticipantId);
    Task<List<ConversationParticipant>> GetAllByConversation(string conversationId);
    Task<ConversationParticipant> GetByConversationAndProfile(
        string conversationId,
        string profileId
    );

    Task<ConversationParticipant> AddToConversation(string conversationId, string profileId);
    Task<ConversationParticipant> AddManualToConversation(
        string conversationParticipantId,
        string profileId
    );
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

//   public async Task<Conversation> GetConversationById(string id)
// {
//     try
//     {
//         Conversation conversation = await _cyDbContext
//             .Conversations.Include(c => c.Participants)
//             .Include(c => c.Messages)
//             .Where(c => c.Id == id)
//             .FirstOrDefaultAsync();

//         if (conversation == null)
//         {
//             throw new Exception("Conversation not found");
//         }
//         else
//         {
//             return conversation;
//         }
//     }
//     catch (Exception e)
//     {
//         throw new Exception("Error fetching conversation", e);
//     }
// }

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
