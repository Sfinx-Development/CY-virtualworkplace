using System;
using System.Threading.Tasks;
using api;
using core;
using services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly UserService _userService;

        public UserController(JwtService jwtService)
        {
            _jwtService = jwtService;
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<User>> GetUserDTO()
        {
            try
            {
                Console.WriteLine("INNE I USER CONTROLLERN");
                var jwt = HttpContext
                    .Request.Headers["Authorization"]
                    .ToString()
                    .Replace("Bearer ", string.Empty);

                Console.WriteLine(jwt);
                if (string.IsNullOrWhiteSpace(jwt))
                {
                    return BadRequest("JWT token is missing.");
                }
                var loggedInUser = _jwtService.GetByJWT(jwt);

                if (loggedInUser == null)
                {
                    return BadRequest("Failed to get user.");
                }
                return Ok(loggedInUser);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

               [HttpPost("Create")]
    public async Task<ActionResult<User>> Post(UserCreateDTO userCreateDto)
    {
        try
        {
           var userCreated = _userService.Create(userCreateDto);
        
            if (userCreated == null)
            {
                return BadRequest("Failed to create movie.");
            }
            // return CreatedAtAction(nameof(GetById), new { id = newMovieDTO.Id }, newMovieDTO);
            return userCreated;
        }
        catch (Exception e)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
        }
    }
    }

 
}