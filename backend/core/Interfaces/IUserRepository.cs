using core;

namespace Interfaces
{
    public interface IUserRepository
    {
        Task<User> GetByIdAsync(string id);
        Task<User> CreateAsync(User user);
        Task<User> UpdateAsync(User user);
        Task DeleteByIdAsync(string id);
        Task<bool> UserEmailIsRegistered(string email);
    }
}
