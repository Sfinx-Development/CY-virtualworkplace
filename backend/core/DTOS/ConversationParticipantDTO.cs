namespace core
{
    public class ConversationParticipantDTO
    {
        public string Id { get; set; }
        public string ProfileId { get; set; }
        public string ConversationId { get; set; }
        public DateTime? LastActive { get; set; }

        public ConversationParticipantDTO() { }

        public ConversationParticipantDTO(
            string id,
            string profileId,
            string conversationId,
            DateTime? lastActive
        )
        {
            Id = id;
            ProfileId = profileId;
            ConversationId = conversationId;
            LastActive = lastActive;
        }
    }
}
