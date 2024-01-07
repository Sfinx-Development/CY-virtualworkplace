using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Interfaces;

namespace core
{
    public class LogInService : ILoginService
    {
        private readonly SymmetricSecurityKey _securityKey;
        private readonly LogInRepository _logInRepository;

        public LogInService(SymmetricSecurityKey securityKey, LogInRepository logInRepository)
        {
            _securityKey = securityKey;
            _logInRepository = logInRepository;
        }

        public async Task<LogInDTO> LogIn(string email, string password)
        {
            try
            {
                User foundUser = await _logInRepository.GetByLogIn(email, password);
                if (foundUser == null)
                {
                    return null;
                }

                string jwtToken = GenerateJwtToken(foundUser);

                LogInDTO logInDTO = new LogInDTO
                {
                    Email = foundUser.Email,
                    Password = foundUser.Password,
                    JWT = jwtToken
                };

                return logInDTO;
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
