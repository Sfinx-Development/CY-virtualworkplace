namespace core;

public class Message
{
    public int Id { get; set; }
    public string Content { get; set; }
    public DateOnly DateCreated { get; set; }
    public Profile Sender { get; set; }
    public Conversation Conversation { get; set; }

    public Message() { }
}
