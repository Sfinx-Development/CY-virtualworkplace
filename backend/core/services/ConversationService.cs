using Interfaces;
using System.Linq;

namespace core
{
    public class ConversationService : IConversationService
    {
        private readonly IConversationRepository _conversationRepository;
        private readonly IProfileRepository _profileRepository;
        private readonly ITeamRepository _teamRepository;
        private readonly IConversationParticipantRepository _conversationParticipantRepository;
        private readonly IMessageRepository _messageRepository;

        public ConversationService(IConversationRepository conversationRepository, IProfileRepository profileRepository, ITeamRepository teamRepository, IConversationParticipantRepository conversationParticipantRepository, IMessageRepository messageRepository)
        {
            _conversationRepository = conversationRepository;
            _profileRepository = profileRepository;
            _teamRepository = teamRepository;
            _conversationParticipantRepository = conversationParticipantRepository;
            _messageRepository = messageRepository;
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

        public async Task<List<Message>> GetConversationWithAllMessages(string conversationParticipantId, User user)
        {
            try
            {

                var conversationParticipant = await _conversationParticipantRepository.GetConversationById(conversationParticipantId);

                if (conversationParticipant == null)
                {
                    throw new Exception("Conversation participant not found.");
                }

                if (user.Id == conversationParticipant.Profile.UserId)
                {
                    var participants = await _conversationParticipantRepository.GetAllByConversation(conversationParticipant.ConversationId);
                    // var messages = await _messageRepository.GetAllMessagesInConversation(conversationParticipantId);
                    var allMessages = participants.SelectMany(p => p.Messages).ToList();
                    if(allMessages == null)
                    {
                        return new List<Message>();
                    }

                    return allMessages.ToList();
                }
                else{
                    throw new Exception("Den som gör anropet är inte rätt profil");
                }
            }
            catch (Exception ex)
            {
                throw new Exception( ex.Message);
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




