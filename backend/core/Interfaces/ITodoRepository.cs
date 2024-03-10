
using core;

namespace Interfaces;

public interface ITodoRepository
{
    Task<Todo> CreateAsync(Todo todo);
    // Task<Todo> GetByIdAsync(string todoId);
    // Task<Todo> UpdateAsync(Todo todo);
    // Task DeleteByIdAsync(string id);
}
