namespace core
{
    public class ConversationParticipant
    {
        public string Id { get; set; }
        public string ConversationId { get; set; }
        public string ProfileId { get; set; }
        public Profile Profile { get; set; }
        public Conversation Conversation { get; set; }
    
    }
}
