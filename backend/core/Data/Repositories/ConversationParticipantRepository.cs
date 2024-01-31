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

 public async Task<ConversationParticipant> AddManualToConversation(string conversationParticipantId, string profileId)
    {
        try
        {
            var conversationParticipant = await _cyDbContext
                .ConversationParticipants
                .Include(c => c.Profile)
                .Include(c => c.Conversation)
                .FirstOrDefaultAsync(c => c.Id == conversationParticipantId);

            if (conversationParticipant == null)
            {
                throw new Exception("Conversation participant not found.");
            }

            var profile = await _cyDbContext.Profiles.FindAsync(profileId);

            if (profile == null)
            {
                throw new Exception("Profile not found.");
            }
           
           var newConversationParticipant = new ConversationParticipant()
           {
                Id = Utils.GenerateRandomId(),
                Profile = profile,
                Conversation = conversationParticipant.Conversation,
           };
           
            // lägg till denna senare
        //    var welcomeMessage = new Message
        //     {
        //         Id = Utils.GenerateRandomId(),
        //         Content = "Välkommen till konversationen!",
        //         // Fler egenskaper...
        //     };

         
           
            await _cyDbContext.SaveChangesAsync();

            return newConversationParticipant;
        }
        catch (Exception e)
        {
            throw new Exception("Ett fel uppstod när profilen lades till i konversationen.", e);
        }
    }

     public async Task<ConversationParticipant> AddToConversation(string conversationId, string profileId)
    {
        try
        {
            var getProfile = await _cyDbContext.Profiles.Where(p => p.Id == profileId).FirstAsync();
           var getConversation = await _cyDbContext.Conversations.Where(c => c.Id == conversationId).FirstAsync();
           var newConversationParticipant = new ConversationParticipant()
           {
                Id = Utils.GenerateRandomId(),
                Profile = getProfile,
                Conversation = getConversation,
           };

           await _cyDbContext.SaveChangesAsync();
           return newConversationParticipant;
        }
        catch(Exception e)
        {
            throw new Exception(e.Message);
        }
    }
    // Andra metoder för att hantera ConversationParticipant-relationer om det behövs





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