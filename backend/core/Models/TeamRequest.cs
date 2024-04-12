namespace core;

public class TeamRequest
{
    public string Id { get; set; }
    public string UserId { get; set; }
    public string TeamId { get; set; }
    public string TeamName { get; set; }
    public bool CanJoin { get; set; }
    public bool IsConfirmed { get; set; }

    public TeamRequest(
        string id,
        string userId,
        string teamId,
        string teamName,
        bool canJoin,
        bool isConfirmed
    )
    {
        Id = id;
        UserId = userId;
        TeamId = teamId;
        TeamName = teamName;
        CanJoin = canJoin;
        IsConfirmed = isConfirmed;
    }
}
