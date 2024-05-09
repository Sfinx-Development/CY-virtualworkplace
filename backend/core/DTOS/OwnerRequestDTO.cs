namespace core;

public class OwnerRequestDTO
{
    public string Id { get; set; }
    public string ProfileId { get; set; }
    public string TeamName { get; set; }
    public bool IsOwner { get; set; }
    public bool IsConfirmed { get; set; }

    public OwnerRequestDTO(
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
