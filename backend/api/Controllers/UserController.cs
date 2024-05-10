using System;
using System.Security.Permissions;
using System.Threading.Tasks;
using api;
using core;
using Interfaces;
using Microsoft.AspNetCore.Authentication.Cookies;
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
        private readonly IUserService _userService;
        private readonly ILogger<UserController> _logger;

        public UserController(
            JwtService jwtService,
            IUserService userService,
            ILogger<UserController> logger
        )
        {
            _jwtService = jwtService;
            _userService = userService;
            _logger = logger;
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

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<UserDTO>> GetUserDTO()
        {
            try
            {
                var jwtCookie = Request.Cookies["jwttoken"];

                if (jwtCookie != null)
                {
                    _logger.LogInformation("----- JWT SKAPAS------");
                }
                else
                {
                    Console.WriteLine("JWT Cookie is not set or not available.");
                }

                if (string.IsNullOrWhiteSpace(jwtCookie))
                {
                    return BadRequest("JWT token is missing.");
                }
                var loggedInUser = await _jwtService.GetByJWT(jwtCookie);
                var userDTO = new UserDTO(
                    loggedInUser.Id,
                    loggedInUser.FirstName,
                    loggedInUser.LastName,
                    loggedInUser.Email,
                    loggedInUser.PhoneNumber,
                    loggedInUser.Gender,
                    loggedInUser.Age,
                    loggedInUser.AvatarUrl,
                    loggedInUser.DateCreated
                );

                if (loggedInUser == null)
                {
                    return BadRequest("Failed to get user.");
                }
                return Ok(userDTO);
            }
            catch (Exception e)
            {
                _logger.LogError("------------error:" + e.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetById(string id)
        {
            try
            {
                UserDTO foundUser = await _userService.GetById(id);
                return Ok(foundUser);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<UserDTO>> Post([FromBody] UserCreateDTO userCreateDto)
        {
            try
            {
                var userCreated = await _userService.Create(userCreateDto);

                if (userCreated == null)
                {
                    return BadRequest("Failed to create user.");
                }
                return CreatedAtAction(nameof(GetById), new { id = userCreated.Id }, userCreated);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<ActionResult<UserDTO>> UpdateUser(UserDTO user)
        {
            try
            {
              var loggedInUser = await GetLoggedInUserAsync();

                UserDTO updatedUser = await _userService.Edit(user);
                return Ok(updatedUser);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpDelete]
        [Authorize]
        public async Task<ActionResult> DeleteUser()
        {
            try
            {
               var loggedInUser = await GetLoggedInUserAsync();
                await _userService.DeleteById(loggedInUser.Id);
                return NoContent();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
