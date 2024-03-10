
using core;

namespace Interfaces;

public interface ITodoRepository
{
    Task<Todo> CreateAsync(Todo todo);
    Task<List<Todo>> GetByTeamIdAsync(string teamId);
    Task<Todo> GetByIdAsync(string todoId);
    Task DeleteByIdAsync(string id);
    // Task<Todo> GetByIdAsync(string todoId);
    // Task<Todo> UpdateAsync(Todo todo);
    // Task DeleteByIdAsync(string id);
}
