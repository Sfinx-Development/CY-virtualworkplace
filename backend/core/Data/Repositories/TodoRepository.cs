using Interfaces;
using Microsoft.EntityFrameworkCore;

namespace core;

public class TodoRepository : ITodoRepository
{
    private readonly CyDbContext _cyDbContext;

    public TodoRepository(CyDbContext cyDbContext)
    {
        _cyDbContext = cyDbContext;
    }

     public async Task<Todo> CreateAsync(Todo todo)
    {
        try
        {
            await _cyDbContext.Todos.AddAsync(todo);
            await _cyDbContext.SaveChangesAsync();
            return todo;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<Todo> GetByIdAsync(string todoId)
    {
        try
        {
           Todo todo = await _cyDbContext.Todos.FirstAsync(t => t.Id == todoId);
            if (todo != null)
            {
                return todo;
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



    public async Task<List<Todo>> GetByTeamIdAsync(string teamId)
    {
        try
        {
            var todos = await _cyDbContext.Todos.Where(t => t.TeamId == teamId).ToListAsync(); 
            return todos;
        }
        catch (Exception e)
        {
            throw new Exception();
        }
       
    }

        // public async Task<List<Team>> GetByUserIdAsync(string userId)
    // {
    //     try
    //     {
    //         var teams = await _cyDbContext
    //             .Teams.Where(t => t.Profiles.Any(p => p.UserId == userId))
    //             .ToListAsync();
    //         return teams;
    //     }
    //     catch (Exception e)
    //     {
    //         throw new Exception();
    //     }
    // }

    // public async Task<Todo> UpdateAsync(Todo todo)
    // {
    //     try
    //     {
    //         var todoToUpdate = await _cyDbContext.Teams.FirstAsync(t => t.Id == todo.Id);

    //         if (todoToUpdate == null)
    //         {
    //             throw new Exception();
    //         }

    //         todoToUpdate.Name = todo.Name ?? todoToUpdate.Name;
    //         todoToUpdate.Code = todo.Code ?? todoToUpdate.Code;
    //         todoToUpdate.TeamRole = todo.TeamRole ?? todoToUpdate.TeamRole;

    //         _cyDbContext.Todo.Update(todoToUpdate);

    //         await _cyDbContext.SaveChangesAsync();
    //         return todoToUpdate;
    //     }
    //     catch (Exception e)
    //     {
    //         throw new Exception();
    //     }
    // }

    public async Task DeleteByIdAsync(string id)
    {
        try
        {
         
            var todoToDelete = await _cyDbContext.Todos.FindAsync(id);
            var deletedTodo = todoToDelete;
            if (todoToDelete != null)
            {
                _cyDbContext.Todos.Remove(todoToDelete);
                await _cyDbContext.SaveChangesAsync();
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}
