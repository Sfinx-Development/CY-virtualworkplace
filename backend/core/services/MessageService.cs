namespace core;

using System.ComponentModel;
using Interfaces;

public class MessageService : IMessageService
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IMessageRepository _messageRepository;
    private readonly IConversationParticipantRepository _conversationParticipantRepository;

    public MessageService(
        IConversationRepository conversationRepository,
        IMessageRepository messageRepository,
        IConversationParticipantRepository conversationParticipantRepository
    )
    {
        _conversationRepository = conversationRepository;
        _messageRepository = messageRepository;
        _conversationParticipantRepository = conversationParticipantRepository;
    }

    public async Task<Message> CreateMessageInConversation(
        IncomingMessageDTO incomingMessageDTO,
        string loggedInUserId
    )
    {
        try
        {
            var conversationParticipant =
                await _conversationParticipantRepository.GetConversationParticipantById(
                    incomingMessageDTO.ConversationParticipantId
                );

            if (conversationParticipant == null)
            {
                throw new Exception("Conversation participant not found.");
            }

            if (conversationParticipant.Profile.UserId == loggedInUserId)
            {
                var newMessage = new Message(
                    Utils.GenerateRandomId(),
                    incomingMessageDTO.Content,
                    DateTime.Now,
                    incomingMessageDTO.ConversationParticipantId,
                    conversationParticipant.ConversationId
                );
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

    public async Task DeleteAsync(string messageId, User loggedInUser)
    {
        try
        {
            var message = await _messageRepository.GetByIdAsync(messageId);
            if (message.ConversationParticipant.Profile.UserId == loggedInUser.Id)
            {
                await _messageRepository.DeleteByIdAsync(message.Id);
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<Message> EditAsync(IncomingMessageDTO incomingMessageDTO, User loggedInUser)
    {
        try
        {
            var messageToEdit = await _messageRepository.GetByIdAsync(incomingMessageDTO.MessageId);
            if (messageToEdit.ConversationParticipant.Profile.UserId == loggedInUser.Id)
            {
                messageToEdit.Content = incomingMessageDTO.Content;
                var editedMessage = await _messageRepository.Edit(messageToEdit);
                return editedMessage;
            }
            else
            {
                throw new Exception("message can't be found");
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

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
