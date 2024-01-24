namespace core;

public class LogInDTO
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string JWT { get; set; }

    public LogInDTO() { }
}

public class LogInDTONoJwt
{
    public string Email { get; set; }
    public string Password { get; set; }
}
