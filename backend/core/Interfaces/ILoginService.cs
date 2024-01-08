using core;

namespace Interfaces;

public interface ILoginService
{

       Task<LogInDTO> LogIn(string email, string password);
      
  
}