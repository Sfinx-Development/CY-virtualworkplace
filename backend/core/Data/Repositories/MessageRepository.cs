using Interfaces;
using Microsoft.EntityFrameworkCore;

namespace core;


public class MessageRepository: IMessageRepository
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
        catch (Exception e)
        {
            throw new Exception();
        }
    }
//   public async Task<Message> GetByIdAsync(string messageId)
//     {
//         try
//         {
//             Message message = await _cyDbContext.Messages.FirstAsync(m => m.Id == messageId);
//             if (message != null)
//             {
//                 return message;
//             }
//             else
//             {
//                 throw new Exception();
//             }
//         }
//         catch (Exception e)
//         {
//             throw new Exception();
//         }
//     }

//     public async Task<List<Message>> GetAllOccasionsByMeetingId(string id)
//     {
//         try
//         {
//             List<Message> conversations = await _cyDbContext
//                 .Messages.Where(me => me.Conversation.Id == id)
//                 .ToListAsync();
//             return conversations;
//         }
//         catch (Exception)
//         {
//             throw new Exception();
//         }
//     }

//     public async Task DeleteByIdAsync(string id)
//     {
//         try
//         {
//             var messageToDelete = await _cyDbContext.Messages.FindAsync(id);
//             var deletedMessage = messageToDelete;
//             if (messageToDelete != null)
//             {
//                 _cyDbContext.Messages.Remove(messageToDelete);
//                 await _cyDbContext.SaveChangesAsync();
//             }
//         }
//         catch (Exception e)
//         {
//             throw new Exception(e.Message);
//         }
//     }

//      public async Task<Message> UpdateAsync(Message message)
//     {
//         try
//         {
//             var messageToUpdate = await _cyDbContext.Messages.FirstAsync(m => m.Id == message.Id);

//             if (messageToUpdate == null)
//             {
//                 throw new Exception();
//             }

//             messageToUpdate.Content = message.Content ?? messageToUpdate.Content;
//             messageToUpdate.Conversation = message.Conversation ?? messageToUpdate.Conversation;


//             _cyDbContext.Messages.Update(messageToUpdate);

//             await _cyDbContext.SaveChangesAsync();
//             return messageToUpdate;
//         }
//         catch (Exception e)
//         {
//             throw new Exception();
//         }
//     }
}
