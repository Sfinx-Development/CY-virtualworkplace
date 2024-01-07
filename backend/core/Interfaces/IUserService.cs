using core;

namespace Interfaces;

public interface IUserService
{
    Task<User> Create(UserCreateDTO userCreateDto);
    Task<User> Edit(User user);
    Task<User> GetById(string id);
    Task<bool> DeleteById(string id);
    string GenerateRandomId(int length = 8);
}