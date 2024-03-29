namespace core;

public class ProjectDTO
{
    public string Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime EndDate { get; set; }
    public string TeamId { get; set; }

    public ProjectDTO() { }
}
