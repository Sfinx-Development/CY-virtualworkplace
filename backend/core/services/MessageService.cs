namespace core;


using Interfaces;

public class MessageService : IMessageService
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IMessageRepository _messageRepository;
    private readonly IConversationParticipantRepository _conversationParticipantRepository;

    public MessageService(
        IConversationRepository conversationRepository,
        IMessageRepository messageRepository,
        IConversationParticipantRepository conversationParticipantRepository)
    {
        _conversationRepository = conversationRepository;
        _messageRepository = messageRepository;
        _conversationParticipantRepository = conversationParticipantRepository;
    }


public async Task<Message> CreateMessageInConversation(IncomingMessageDTO incomingMessageDTO, string loggedInUserId)
{
    try
    {
        var conversationParticipant = await _conversationParticipantRepository.GetConversationById(incomingMessageDTO.ConversationParticipantId);

        if (conversationParticipant == null)
        {
            throw new Exception("Conversation participant not found.");
        }

        if (conversationParticipant.Profile.UserId == loggedInUserId)
        {
         
            var newMessage = new Message
            {
                Id = Utils.GenerateRandomId(),
                ConversationParticipantId = conversationParticipant.Id,
                Content = incomingMessageDTO.Content,
                DateCreated = DateTime.Now
            };

            
            return await _messageRepository.CreateAsync(newMessage);
        }
        else
        {
            throw new Exception();
        }
    }
    catch (Exception)
    {
        throw new Exception();
    }
}


    // public async List<Message> GetAll(Conversation conversation, User user)
    // {
    //     try
    //     {
    //          return await _messageRepository.GetByIdAsync(conversation.Id);
    //     }
    //     catch (Exception)
    //     {
    //         throw new Exception();
    //     }
    // }

    // public async Task RemoveConversationAndMessages(Conversation conversation, Message messages)
    // {
    //      try
    // {
    //     var conversation1 = await _conversationRepository.GetConversationById(conversation.Id);
    //     var messages1 = await _messageRepository.GetByIdAsync(messages.Id);

    //     if (conversation1.Id == messages1.ConversationId)
    //     {
    //         var messagesInConversation = conversation1.Messages;

    //         foreach (var m in messagesInConversation)
    //         {
    //             await _messageRepository.DeleteByIdAsync(m.Id);
    //         }

    //         await _conversationRepository.DeleteConversationByIdAsync(conversation1.Id);
    //     }
    // }
    //     catch (Exception)
    //     {
    //         throw new Exception();
    //     }
    // }
}

