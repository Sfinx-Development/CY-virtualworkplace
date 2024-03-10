using System;
using Interfaces;

namespace core;

public class TodoService : ITodoService
{
    private readonly IProfileRepository _profileRepository;
    private readonly ITeamRepository _teamRepository;
    private readonly IHealthCheckRepository _healthCheckRepository;
    private readonly IProfileHealthCheckRepository _profileHealthCheckRepository;
    private readonly ITodoRepository _todoRepository;

    public TodoService(
        IProfileRepository profileRepository,
        IHealthCheckRepository healthCheckRepository,
        ITeamRepository teamRepository,
        IProfileHealthCheckRepository profileHealthCheckRepository,
        ITodoRepository todoRepository
    )
    {
        _profileRepository = profileRepository;
        _healthCheckRepository = healthCheckRepository;
        _teamRepository = teamRepository;
        _profileHealthCheckRepository = profileHealthCheckRepository;
        _todoRepository = todoRepository;
    }


     public async Task<TodoDTO> CreateTodo(TodoDTO todo, User loggedInUser)
    {
        try
        {
            //kolla om den som begär är en del av teamet
            var profile = await _profileRepository.GetByUserAndTeamIdAsync(
                loggedInUser.Id,
                todo.TeamId
            ) ?? throw new Exception("Ingen profil i teamet");
            Todo newTodo =
                 new(
                     Utils.GenerateRandomId(),
                     todo.TeamId,
                     todo.Description,
                     todo.Title,
                     todo.Date
                 );


            Todo createdTodo = await _todoRepository.CreateAsync(
                newTodo
            );

               TodoDTO newTodoDTO =
                 new(
                     createdTodo.Id,
                     createdTodo.TeamId,
                     createdTodo.Description,
                      createdTodo.Date,
                     createdTodo.Title
                    
                 );

            return newTodoDTO;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

      public async Task<Todo> UpdateTodo(TodoDTO todoDTO)
    {
        try
        {
            var foundTodo =
                await _todoRepository.GetByIdAsync(todoDTO.Id) ?? throw new Exception();

            foundTodo.Title = todoDTO.Title ?? foundTodo.Title;
            foundTodo.Description = todoDTO.Description ?? foundTodo.Description;
            foundTodo.Date = todoDTO.Date.AddHours(1);
            // foundMeeting.Minutes = meeting.Minutes;
            // foundMeeting.IsRepeating = meeting.IsRepeating;
            // foundMeeting.Interval = meeting.Interval;
            // foundMeeting.EndDate = meeting.EndDate;
            var updatedTodo = await _todoRepository.UpdateAsync(foundTodo);
            return updatedTodo;
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    // public async Task<HealthCheck> UpdateHealthCheck(HealthCheckDTO healthCheck, User loggedInUser)
    // {
    //     try
    //     {
    //         var foundHealthCheck =
    //             await _healthCheckRepository.GetByIdAsync(healthCheck.Id) ?? throw new Exception();
    //         var profile = await _profileRepository.GetByUserAndTeamIdAsync(
    //             loggedInUser.Id,
    //             healthCheck.TeamId
    //         );

    //         if (!profile.IsOwner)
    //         {
    //             throw new Exception("Only owner of team can update healthcheck");
    //         }

    //         foundHealthCheck.Question = healthCheck.Question ?? foundHealthCheck.Question;
    //         foundHealthCheck.StartTime = healthCheck.StartTime;
    //         foundHealthCheck.EndTime = healthCheck.EndTime;

    //         var updatedHealthCheck = await _healthCheckRepository.UpdateAsync(foundHealthCheck);
    //         return updatedHealthCheck;
    //     }
    //     catch (Exception e)
    //     {
    //         throw new Exception(e.Message);
    //     }
    // }

    public async Task<Todo> GetTodoById(string id)
    {
        try
        {
            var todo = await _todoRepository.GetByIdAsync(id);

            if (todo == null)
            {
                throw new Exception("Todo can't be found");
            }
            else
            {
                return todo;
            }
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task<List<Todo>> GetByTeam(string teamId, User loggedInUser)
    {
        try
        {
            // var team = await _teamRepository.GetByIdAsync(teamId);
            // if (team.Profil != loggedInUser.Id)
            // {
            //     throw new Exception("Not valid user");
            // }
            var todos = await _todoRepository.GetByTeamIdAsync(teamId);
          
            // var now = new DateTime();
           
            // var healthChecksValidNow = healthChecks.FindAll(
            //     h => h.StartTime >= now && h.EndTime < now
            // );
            return todos;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    // // public async Task DeleteHealthCheckAndProfileChecks(string HealthCheckId, string loggedInUserId)
    // // {
    // //     try
    // //     {
    // //         var HealthCheck = await _HealthCheckRepository.GetByIdAsync(HealthCheckId);
    // //         var profile = await _profileRepository.GetByIdAsync(HealthCheck.OwnerId);
    // //         if (profile.UserId == loggedInUserId)
    // //         {
    // //             //hämta alla HealthCheckoccasions för mötet och radera dom sen mötet
    // //             var HealthCheckOccasions =
    // //                 await _HealthCheckOccasionRepository.GetAllOccasionsByHealthCheckId(
    // //                     HealthCheck.Id
    // //                 );

    // //             foreach (var mo in HealthCheckOccasions)
    // //             {
    // //                 await _HealthCheckOccasionRepository.DeleteByIdAsync(mo.Id);
    // //             }

    // //             await _HealthCheckRepository.DeleteByIdAsync(HealthCheck.Id);
    // //         }
    // //         else
    // //         {
    // //             throw new Exception("Only owner can delete HealthCheck");
    // //         }
    // //     }
    // //     catch (Exception)
    // //     {
    // //         throw new Exception();
    // //     }
    // // }

    public async Task DeleteById(string id, User loggedInUser)
    {
        try
        {
            //när denna raderas så ska alla profilers svar också raderas
            var todo = await _todoRepository.GetByIdAsync(id);
            var profile = await _profileRepository.GetByUserAndTeamIdAsync(
                loggedInUser.Id,
                todo.TeamId
            );
          
            //kolla här så den som raderar är ägaren av teamet
            //hämta ut healthcheck sen matcha loggedinuser med ownerns userid
            // foreach (var profileHC in profileHealthChecks)
            // {
            //     await _profileHealthCheckRepository.DeleteByIdAsync(profileHC.Id);
            // }
            await _todoRepository.DeleteByIdAsync(id);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}
