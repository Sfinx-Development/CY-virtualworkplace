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

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<TodoDTO>> Post([FromBody] TodoDTO todo)
        {
            try
            {
                var jwt = Request.Cookies["jwttoken"];
                if (string.IsNullOrWhiteSpace(jwt))
                {
                    return BadRequest("JWT token is missing.");
                }
                var loggedInUser = await _jwtService.GetByJWT(jwt);

                if (loggedInUser == null)
                {
                    return BadRequest("Failed to get user.");
                }

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
        [HttpGet("teamid:string")]
        [Authorize]
        public async Task<ActionResult<List<TodoDTO>>> Get(string teamId)
        {
            try
            {
                var jwt = Request.Cookies["jwttoken"];
                if (string.IsNullOrWhiteSpace(jwt))
                {
                    return BadRequest("JWT token is missing.");
                }

                var loggedInUser = await _jwtService.GetByJWT(jwt);

                if (loggedInUser == null)
                {
                    return BadRequest("Failed to get user.");
                }

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

        [HttpGet("id:string")]
        [Authorize]
        public async Task<ActionResult<Todo>> GetById(string id)
        {
            try
            {
                var jwt = Request.Cookies["jwttoken"];
                if (string.IsNullOrWhiteSpace(jwt))
                {
                    return BadRequest("JWT token is missing.");
                }

                var loggedInUser = await _jwtService.GetByJWT(jwt);

                if (loggedInUser == null)
                {
                    return BadRequest("Failed to get user.");
                }

                var todo = await _todoService.GetTodoById(id);

                return Ok(todo);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Authorize]
        [HttpDelete("{id:string}")]
        public async Task<ActionResult> Delete(string id)
        {
            try
            {
                var jwt = Request.Cookies["jwttoken"];
                if (string.IsNullOrWhiteSpace(jwt))
                {
                    return BadRequest("JWT token is missing.");
                }

                var loggedInUser = await _jwtService.GetByJWT(jwt);

                if (loggedInUser == null)
                {
                    return BadRequest("Failed to get user.");
                }

                await _todoService.DeleteById(id, loggedInUser);

                return Ok("Successfully deleted Todo.");
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
                var jwt = Request.Cookies["jwttoken"];

                if (string.IsNullOrWhiteSpace(jwt))
                {
                    return BadRequest("JWT token is missing.");
                }
                var loggedInUser = await _jwtService.GetByJWT(jwt);

                if (loggedInUser == null)
                {
                    return BadRequest("JWT token is missing.");
                }

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
