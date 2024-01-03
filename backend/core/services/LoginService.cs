using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace core
{
    public class LogInService
    {
        // private readonly ILogInDB<User> _logInUser;
        private readonly SymmetricSecurityKey _securityKey;

        public LogInService(SymmetricSecurityKey securityKey)
        {
            // _logInUser = logInUser;
            _securityKey = securityKey;
        }

        public LogInDTO LogIn(string email, string passWord)
        {
            try
            {
                // User user = _logInUser.GetMemberByLogIn(email, passWord);
                if (email == "kalle@mail.com" && passWord == "Hej123")
                {
                    Console.WriteLine("INNE I IF I LOGISERVICE");
                    User user = new();
                    user.Id = "12312481";
                    user.Email = email;
                    string jwtToken = GenerateJwtToken(user);

                    LogInDTO logInDTO = new LogInDTO
                    {
                        Email = email,
                        Password = passWord,
                        JWT = jwtToken
                    };

                    return logInDTO;
                }

                return null;
            }
            catch (InvalidOperationException)
            {
                return null;
            }
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                Console.WriteLine("USERN: " + user.Email + user.Id);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Issuer = "CY-VirtualWorkplace",
                    Audience = "api",
                    Subject = new ClaimsIdentity(
                        new Claim[]
                        {
                            new Claim(ClaimTypes.Name, user.Email),
                            new Claim("UserId", user.Id.ToString())
                        }
                    ),
                    Expires = DateTime.UtcNow.AddDays(14),
                    SigningCredentials = new SigningCredentials(
                        _securityKey,
                        SecurityAlgorithms.HmacSha256Signature
                    )
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                return tokenHandler.WriteToken(token);
            }
            catch (FormatException ex)
            {
                Console.WriteLine($"error converting Base64 string: {ex.Message}");
                return null;
            }
        }
    }
}
