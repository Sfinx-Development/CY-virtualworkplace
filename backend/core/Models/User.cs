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
    public string AvatarUrl { get; set; }
    public DateTime DateCreated { get; set; }
    public List<Profile> Profiles = new();

    public User() { }

    public User(
        string id,
        string firstName,
        string lastName,
        string email,
        string password,
        string phoneNumber,
        string gender,
        int age,
        string avatarUrl,
        DateTime dateCreated
    )
    {
        Id = id;
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        Password = password;
        PhoneNumber = phoneNumber;
        Gender = gender;
        Age = age;
        AvatarUrl = avatarUrl;
        DateCreated = dateCreated;
    }
}
