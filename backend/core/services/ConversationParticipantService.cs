using System.Linq;
using Interfaces;

namespace core
{
    public class ConversationParticipantService : IConversationParticipantService
    {
        private readonly IConversationRepository _conversationRepository;
        private readonly IProfileRepository _profileRepository;
        private readonly ITeamRepository _teamRepository;
        private readonly IConversationParticipantRepository _conversationParticipantRepository;
        private readonly IMessageRepository _messageRepository;

        public ConversationParticipantService(
            IConversationRepository conversationRepository,
            IProfileRepository profileRepository,
            ITeamRepository teamRepository,
            IConversationParticipantRepository conversationParticipantRepository,
            IMessageRepository messageRepository
        )
        {
            _conversationRepository = conversationRepository;
            _profileRepository = profileRepository;
            _teamRepository = teamRepository;
            _conversationParticipantRepository = conversationParticipantRepository;
            _messageRepository = messageRepository;
        }

        public async Task<ConversationParticipant> Update(
            ConversationParticipantDTO conversationParticipantDTO
        )
        {
            try
            {
                var conversationPartToUpdate =
                    await _conversationParticipantRepository.GetConversationParticipantById(
                        conversationParticipantDTO.Id
                    ) ?? throw new Exception("No conversation participant found.");
                conversationPartToUpdate.LastActive = conversationParticipantDTO.LastActive;
                var updatedConversationPart = await _conversationParticipantRepository.Update(
                    conversationPartToUpdate
                );
                return updatedConversationPart;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}
