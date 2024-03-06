namespace core;

public class Todo
{
    public string Id { get; set; }
    public string? Description { get; set; }
    public string Title { get; set; }
    public DateTime Date { get; set; }
    public Team? Team { get; set; }
    public string? TeamId { get; set; }

    public Todo() { }
}