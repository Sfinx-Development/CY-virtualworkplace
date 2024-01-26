using Interfaces;



namespace core
{
    public class ConversationService
    {
        private readonly IConversationRepository _conversationRepository;
        private readonly IProfileRepository _profileRepository;
        private readonly ITeamRepository _teamRepository;
        private readonly IConversationParticipantRepository _conversationParticipantRepository;

        public ConversationService(IConversationRepository conversationRepository, IProfileRepository profileRepository, ITeamRepository teamRepository, IConversationParticipantRepository conversationParticipantRepository)
        {
            _conversationRepository = conversationRepository;
            _profileRepository = profileRepository;
            _teamRepository = teamRepository;
            _conversationParticipantRepository = conversationParticipantRepository;
        }

        public async Task<Conversation> CreateConversationAsync(string creatorUserId, string teamId)
        {
            try
            {
                var team = await _teamRepository.GetByIdAsync(teamId);

                if (!team.Profiles.Any(p => p.UserId == creatorUserId))
                {
                    throw new Exception();
                }

                var teamProfiles = await _profileRepository.GetProfilesInTeamAsync(teamId);

                if (teamProfiles == null || !teamProfiles.Any())
                {
                    throw new Exception();
                }

                var creatorProfile = teamProfiles.Find(p => p.UserId == creatorUserId);

                var newConversation = new Conversation
                {
                    Id = Utils.GenerateRandomId(),
                    DateCreated = DateTime.Now,
                    CreatorId = creatorProfile.Id,
                    Messages = new List<Message>()
                };

                var createdConversation = await _conversationRepository.Create(newConversation);

                foreach (var profile in teamProfiles)
                {
                    var participant = new ConversationParticipant
                    {
                        Id = Utils.GenerateRandomId(),
                        ConversationId = createdConversation.Id,
                        ProfileId = profile.Id,
                    };

                    var conversations = await _conversationParticipantRepository.Create(participant);

                    // Lägg till logik för att spara i databasen här (t.ex. anropa en metod i _conversationService)
                }
                return createdConversation;
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




