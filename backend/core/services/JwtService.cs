﻿using System.IdentityModel.Tokens.Jwt;
using Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace core
{
    public class JwtService
    {
        private readonly IUserRepository _userRepository;

        public JwtService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<User> GetByJWT(string jwt)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var token = tokenHandler.ReadToken(jwt) as JwtSecurityToken;

                if (token != null)
                {
                    var idClaim = token.Claims.FirstOrDefault(
                        claim => claim.Type == "sub" || claim.Type == "UserId"
                    );

                    if (idClaim != null)
                    {
                        User user = await _userRepository.GetByIdAsync(idClaim.Value);
                        return user;
                    }
                }

                return null;
            }
            catch (SecurityTokenException)
            {
                return null;
            }
        }
    }
}
