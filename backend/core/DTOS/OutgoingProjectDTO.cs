namespace core;

public class OutgoingProjectDTO
{
    public string Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string DateCreated { get; set; }
    public string EndDate { get; set; }
    public string TeamId { get; set; }

    public OutgoingProjectDTO(
        string id,
        string title,
        string description,
        DateTime dateCreated,
        DateTime endDate,
        string teamId
    )
    {
        Id = id;
        Title = title;
        Description = description;
        DateCreated = dateCreated.ToString("yyyy-MM-ddTHH:mm:ss");
        EndDate = endDate.ToString("yyyy-MM-ddTHH:mm:ss");
        TeamId = teamId;
    }
}
