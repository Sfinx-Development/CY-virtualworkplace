namespace core;

public class UserDTO
{
    public string Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string Gender { get; set; }
    public int Age { get; set; }
    public string AvatarUrl { get; set; }
    public string DateCreated { get; set; }

    public UserDTO(
        string id,
        string firstName,
        string lastName,
        string email,
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
        PhoneNumber = phoneNumber;
        Gender = gender;
        Age = age;
        AvatarUrl = avatarUrl;
        DateCreated = dateCreated.ToString("yyyy-MM-ddTHH:mm:ss");
    }
}
