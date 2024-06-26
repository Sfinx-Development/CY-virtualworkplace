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
        catch (Exception)
        {
            throw new Exception();
        }
    }

    //   public async Task<Conversation> GetConversationOwnerAsync(string conversationId)
    // {
    //     var creatorId = await _cyDbContext.Conversations
    //         .Where(c => c.Id == conversationId)
    //         .FirstOrDefaultAsync();

    //     return creatorId;
    // }

    public async Task<string> GetConversationByProfiles(Team team, string myId)
    {
        try
        {
            var teamet = _cyDbContext
                .Teams.Include(t => t.Profiles)
                .ThenInclude(p => p.ConversationParticipants)
                .ThenInclude(cp => cp.Conversation)
                .FirstOrDefault(t => t.Id == team.Id);

            var profileWithoutMyId = team.Profiles.FirstOrDefault(profile => profile.Id != myId);
            var conversation = profileWithoutMyId.ConversationParticipants;

            //    var commonConversationId = _cyDbContext.ConversationParticipants
            //     .Where(cp => profiles.Contains(cp.Profile))
            //     .GroupBy(cp => cp.ConversationId)
            //     .FirstOrDefault()?.Key;


            return " ";
        }
        catch (Exception e)
        {
            throw new Exception();
        }
    }

    public async Task<Conversation> GetConversationByTeamId(string teamId)
    {
        try
        {
            var conversation = await _cyDbContext
                .Conversations.Include(c => c.Messages)
                .ThenInclude(m => m.ConversationParticipant)
                .Where(c => c.TeamId == teamId)
                .FirstAsync();
            return conversation;
        }
        catch (Exception e)
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
}
