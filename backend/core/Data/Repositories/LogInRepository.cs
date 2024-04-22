using Microsoft.EntityFrameworkCore;

namespace core;

public class LogInRepository
{
    private readonly CyDbContext _cyDbContext;

    public LogInRepository(CyDbContext cyDbContext)
    {
        _cyDbContext = cyDbContext;
    }

    public async Task<User> GetByLogIn(string email)
    {
        try
        {
            User user = await _cyDbContext.Users.FirstAsync(
                u => u.Email.ToLower().Trim() == email.ToLower().Trim()
            );
            if (user != null)
            {
                return user;
            }
            else
            {
                throw new Exception();
            }
        }
        catch (Exception e)
        {
            return null;
        }
    }
}
