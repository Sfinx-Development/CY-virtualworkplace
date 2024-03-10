namespace core;

public class TodoDTO
{
    public string Id { get; set; }
    public string? Description { get; set; }
    public string Title { get; set; }
    public DateTime Date { get; set; }
    public string? TeamId { get; set; }

    public TodoDTO() { }

        public TodoDTO(
        string id,
        string teamId,
        string description,
        DateTime date,
        string title
        
    )
    {
        Id = id;
        TeamId = teamId;
        Description = description;
        Date= date;
        Title = title;
    }
}