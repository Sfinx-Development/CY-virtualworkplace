namespace core
{
    public class ConversationParticipant
    {
        public string Id { get; set; }
        public string ConversationId { get; set; }
        public string ProfileId { get; set; }
        public Profile Profile { get; set; }
        public Conversation Conversation { get; set; }
        public string FullName { get; set; }
        public DateTime? LastActive { get; set; }

        public ConversationParticipant(
            string conversationId,
            string profileId,
            string fullName,
            Profile profile,
            Conversation conversation,
            DateTime? lastActive
        )
        {
            Id = Utils.GenerateRandomId();
            ConversationId = conversationId;
            FullName = fullName;
            Profile = profile;
            Conversation = conversation;
            LastActive = lastActive;
        }

        public ConversationParticipant() { }
    }
}
