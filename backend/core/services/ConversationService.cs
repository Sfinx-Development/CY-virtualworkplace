using Interfaces;



namespace core
{
    public class ConversationService
    {
        private readonly IConversationRepository _conversationRepository;
        private readonly IProfileRepository _profileRepository;

        public ConversationService(IConversationRepository conversationRepository, IProfileRepository profileRepository)
        {
            _conversationRepository = conversationRepository;
            _profileRepository = profileRepository;
        }

        // public async Task<Conversation> CreateAsync(Conversation conversation)
        // {
        //     try
        //     {
        //         return await _conversationRepository.Create(conversation);
        //     }
        //     catch (Exception)
        //     {
        //         throw new Exception();
        //     }
        // }

        // public async Task<Conversation> UpdateAsync(Conversation conversation)
        // {
        //     try
        //     {
        //         return await _conversationRepository.Update(conversation);
        //     }
        //     catch (Exception)
        //     {
        //         throw new Exception();
        //     }
        // }

        // public async Task<Conversation> GetByIdAsync(string id)
        // {
        //     try
        //     {
        //         return await _conversationRepository.GetConversationById(id);
        //     }
        //     catch (Exception )
        //     {
        //         throw new Exception();
        //     }
        // }



public async Task<Conversation> CreateConversationAsync(string creatorUserId)
{
    try
    {
        var creatorProfiles = await _profileRepository.GetProfilesInTeamAsync(creatorUserId);

        if (creatorProfiles == null || !creatorProfiles.Any())
        {
            throw new Exception("Failed to get creator profile.");
        }

        var creatorProfile = creatorProfiles.First(); // Välj den första profilen

        var newConversation = new Conversation
        {
            Id = Guid.NewGuid().ToString(),
            DateCreated = DateTime.Now,
            Creator = creatorProfile,
            Participants = new List<ConversationParticipant> { new ConversationParticipant { ProfileId = creatorUserId } },
            Messages = new List<Message>()
        };

        return await _conversationRepository.Create(newConversation);
    }
    catch (Exception)
    {
        throw new Exception("Failed to create conversation.");
    }
}




// public async Task AddParticipantToConversationAsync(string conversationId, Profile profileToAdd)
// {
//     try
//     {
//         var conversation = await _conversationRepository.GetConversationById(conversationId);

//         if (conversation == null)
//         {
//             throw new Exception("Conversation not found.");
//         }

//         var participantToAdd = new ConversationParticipant
//         {
//             Id = Guid.NewGuid().ToString(),
//             ConversationId = conversationId,
//             ProfileId = profileToAdd.Id
//         };

//         conversation.Participants.Add(participantToAdd);

//         await _conversationRepository.UpdateAsync(conversation);
//     }
//     catch (Exception)
//     {
//         throw new Exception("Failed to add participant to conversation.");
//     }
// }





//         public async Task DeleteByIdAsync(string id)
//         {
//             try
//             {
//                 await _conversationRepository.DeleteConversationByIdAsync(id);
//             }
//             catch (Exception)
//             {
//                 throw new Exception();
//             }
//         }
//     }
}
}


  
    
