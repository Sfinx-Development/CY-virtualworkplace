namespace core;

public class Conversation
{
    public string Id { get; set; }
        public DateTime DateCreated { get; set; }
        public Profile Creator { get; set; }
        public List<ConversationParticipant> Participants { get; set; }
        public List<Message> Messages { get; set; } = new();

    public Conversation() { }
}
