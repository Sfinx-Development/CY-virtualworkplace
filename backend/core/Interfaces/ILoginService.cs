using core;

namespace Interfaces;

public interface ILoginService
{
    Task<string> LogIn(string email, string password);
}
