using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace core
{
    public class LogInService : ILoginService
    {
        private readonly SymmetricSecurityKey _securityKey;
        private readonly LogInRepository _logInRepository;
        private readonly IConfiguration _configuration;

        public LogInService(
            SymmetricSecurityKey securityKey,
            LogInRepository logInRepository,
            IConfiguration configuration
        )
        {
            _securityKey = securityKey;
            _logInRepository = logInRepository;
            _configuration = configuration;
        }

        public async Task<string> LogIn(string email, string password)
        {
            try
            {
                User foundUser = await _logInRepository.GetByLogIn(email);

                if (foundUser == null)
                {
                    return null;
                }

                bool isPasswordCorrect = BCrypt.Net.BCrypt.Verify(password, foundUser.Password);

                if (!isPasswordCorrect)
                {
                    return null;
                }

                string jwtToken = GenerateJwtToken(foundUser);

                return jwtToken;
            }
            catch (InvalidOperationException e)
            {
                throw new Exception(e.Message);
            }
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Issuer = _configuration["Jwt:Issuer"],
                    Audience = _configuration["Jwt:Audience"],
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
