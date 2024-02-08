namespace core;

public class ProfileUpdateDTO
{
    public string Id { get; set; }
    public string FullName { get; set; }
    public string Role { get; set; }
    public bool IsOwner { get; set; }
    public string UserId { get; set; }
    public string TeamId { get; set; }
    public DateTime DateCreated { get; set; }
    public bool? IsOnline { get; set; }

    public ProfileUpdateDTO() { }
}
