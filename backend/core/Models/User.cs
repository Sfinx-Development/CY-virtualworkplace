namespace core;

public class User
{
    public string Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string PhoneNumber { get; set; }
    public string Gender { get; set; }
    public int Age { get; set; }
    public string AvatarUrl{get;set;}
    public DateTime DateCreated { get; set; }
    public List<Profile> Profiles = new();

    public User() { }
}
