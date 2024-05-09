using core;

namespace Interfaces;

public interface IUserService
{
    Task<UserDTO> Create(UserCreateDTO userCreateDto);
    Task<UserDTO> Edit(UserDTO user);
    Task<UserDTO> GetById(string id);
    Task<bool> DeleteById(string id);
}
