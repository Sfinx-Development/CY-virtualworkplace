namespace core;

public class UserCreateDTO
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string PhoneNumber { get; set; }
    public string Role { get; set; }
    public bool IsOwner { get; set; }
    public string Gender { get; set; }
    public int Age { get; set; }
    public DateTime DateCreated { get; set; }

    public UserCreateDTO() { }
}