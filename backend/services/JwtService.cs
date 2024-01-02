using System.IdentityModel.Tokens.Jwt;
using core;
using Microsoft.IdentityModel.Tokens;

namespace services
{
    public class JwtService
    {
        // IDataToObject<User, User> _userDataToObject;

        public JwtService()
        {
            // _userDataToObject = userDataToObject;
        }

        public User GetByJWT(string jwt)
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

                    if (idClaim != null && int.TryParse(idClaim.Value, out int userId))
                    {
                        // User foundUser = _userDataToObject.GetOne(userId, null);
                        User user = new() { FirstName = "Kalle" };
                        return user;
                    }
                }

                return null;
            }
            catch (SecurityTokenException)
            {
                // Tokenet är ogiltigt
                return null;
            }
        }
    }
}
