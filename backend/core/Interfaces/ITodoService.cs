namespace core;

public interface ITodoService
{
Task<TodoDTO> CreateTodo(TodoDTO todo,User loggedInUser);
     Task<List<Todo>> GetByTeam(string teamId, User loggedInUser);
    Task<Todo> GetTodoById(string id);
     Task DeleteById(string id, User loggedInUser);
     // Task<Todo> UpdateTodo(TodoDTO todoDTO);
     Task<Todo> UpdateTodo(TodoDTO todoDTO, User loggedInUser);

}