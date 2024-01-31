namespace core;

public class Conversation
{
    public string Id { get; set; }
        public DateTime DateCreated { get; set; }
        public string CreatorId { get; set; }
        public string? TeamId { get; set; }

    public Conversation() { }
}
