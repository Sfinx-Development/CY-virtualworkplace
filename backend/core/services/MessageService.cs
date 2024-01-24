namespace core;


using Interfaces;

public class MessageService
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IMessageRepository _messageRepository;
    private readonly IProfileRepository _profileRepository;
    private readonly IMeetingRepository _meetingRepository;
    private readonly IMeetingOccasionRepository _meetingOccasionRepository;

    public MessageService(
        IConversationRepository conversationRepository,
        IMessageRepository messageRepository,
        IProfileRepository profileRepository,
        IMeetingRepository meetingRepository,
        IMeetingOccasionRepository meetingOccasionRepository)
    {
        _conversationRepository = conversationRepository;
        _messageRepository = messageRepository;
        _profileRepository = profileRepository;
        _meetingRepository = meetingRepository;
        _meetingOccasionRepository = meetingOccasionRepository;
    }

    public async Task<Message> Create(Message message)
    {
        try
        {
            Message createdMessage = await _messageRepository.CreateAsync(message);
            return createdMessage;
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

