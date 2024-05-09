namespace core;

public class OwnerRequest
{
    public string Id { get; set; }
    public string ProfileId { get; set; }
    public string TeamName { get; set; }
    public bool IsOwner { get; set; }
    public bool IsConfirmed { get; set; }
    public Profile Profile { get; set; }

    public OwnerRequest(
        string id,
        string profileId,
        string teamName,
        bool isOwner,
        bool isConfirmed
    )
    {
        Id = id;
        ProfileId = profileId;
        TeamName = teamName;
        IsOwner = isOwner;
        IsConfirmed = isConfirmed;
    }
}
