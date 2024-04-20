using System;
using System.Security.Permissions;
using System.Threading.Tasks;
using api;
using core;
using core.Migrations;
using Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TodoController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly ITodoService _todoService;

        public TodoController(JwtService jwtService, ITodoService todoService)
        {
            _jwtService = jwtService;
            _todoService = todoService;
        }

        private async Task<User> GetLoggedInUserAsync()
        {
            var jwt = Request.Cookies["jwttoken"];

            if (string.IsNullOrWhiteSpace(jwt))
            {
                throw new Exception("JWT token is missing.");
            }

            var loggedInUser = await _jwtService.GetByJWT(jwt);

            if (loggedInUser == null)
            {
                throw new Exception("Failed to get user.");
            }

            return loggedInUser;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<TodoDTO>> Post([FromBody] TodoDTO todo)
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();
                // Korrekt användning i TodoController
                var createdTodo = await _todoService.CreateTodo(todo, loggedInUser);

                if (createdTodo == null)
                {
                    return BadRequest("Failed to create todo.");
                }
                return CreatedAtAction("Post", createdTodo);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        //    hämta alla by teamet på profilid samt som gäller för nutiden
        [HttpGet("byteam/{teamid}")]
        [Authorize]
        public async Task<ActionResult<List<TodoDTO>>> Get(string teamId)
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();

                var todos = await _todoService.GetByTeam(teamId, loggedInUser);

                var todosDTO = new List<TodoDTO>();
                todosDTO = todos
                    .Select(t => new TodoDTO(t.Id, t.TeamId, t.Description, t.Date, t.Title))
                    .OrderBy(t => t.Date)
                    .ToList();

                return Ok(todosDTO);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Todo>> GetById(string id)
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();
                var todo = await _todoService.GetTodoById(id);

                return Ok(todo);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();

                await _todoService.DeleteById(id, loggedInUser);

                return NoContent();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpPut]
        [Authorize]
        public async Task<ActionResult<Todo>> Update([FromBody] TodoDTO todoDTO)
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();

                Todo updatedTodo = await _todoService.UpdateTodo(todoDTO, loggedInUser);
                return Ok(updatedTodo);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
