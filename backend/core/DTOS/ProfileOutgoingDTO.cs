using System.IO.IsolatedStorage;

namespace core;

public class ProfileOutgoingDTO
{
    public string Id { get; set; }
    public string FullName { get; set; }
    public string Role { get; set; }
    public bool IsOwner { get; set; }
    public string UserId { get; set; }
    public string TeamId { get; set; }
    public DateTime DateCreated { get; set; }
    public bool? IsOnline { get; set; }
    public DateTime? LastOnline { get; set; }
    public DateTime? LastActive { get; set; }
    public string AvatarUrl { get; set; }

    public ProfileOutgoingDTO(
        string id,
        string fullName,
        string role,
        bool isOwner,
        string userId,
        string teamId,
        DateTime dateCreated,
        bool? isOnline,
        DateTime? lastOnline,
        DateTime? lastActive,
        string avatarUrl
    )
    {
        Id = id;
        FullName = fullName;
        Role = role;
        IsOwner = isOwner;
        UserId = userId;
        TeamId = teamId;
        DateCreated = dateCreated;
        IsOnline = isOnline;
        LastOnline = lastOnline;
        LastActive = lastActive;
        AvatarUrl = avatarUrl;
    }
}
