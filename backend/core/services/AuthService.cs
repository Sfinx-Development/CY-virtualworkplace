using System.Net;
using System.Net.Mail;
using Interfaces;

namespace core;

public class AuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IUserService _userService;

    public AuthService(IUserRepository userRepository, IUserService userService)
    {
        _userRepository = userRepository;
        _userService = userService;
    }

    public async Task<bool> SetNewRandomPassword(User user)
    {
        user.Password = Utils.GenerateRandomId();
        var updatedUser = await _userService.Edit(user);
        //skicka mail till användaren med nya lösenordet
        return SendEmail(updatedUser.Password);
    }

    public bool SendEmail(string newPassword)
    {
        string smtpServer = "sandbox.smtp.mailtrap.io";
        int smtpPort = 2525;
        string smtpUsername = "9f3bba08ba6f37";
        string smtpPassword = "9293d44a7e7267";

        var client = new SmtpClient(smtpServer, smtpPort)
        {
            Credentials = new NetworkCredential(smtpUsername, smtpPassword),
            EnableSsl = true
        };

        // Använd variabler för att sätta värden
        string fromEmail = "from@example.com";
        string toEmail = "to@example.com";
        string subject = "New password for CY";
        string body = "Your new password: " + newPassword;

        // Skicka e-post
        client.Send(fromEmail, toEmail, subject, body);

        return true;
    }
}
