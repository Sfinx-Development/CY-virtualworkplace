namespace core;

public interface ITodoService
{
Task<TodoDTO> CreateTodo(TodoDTO todo,User loggedInUser);

}