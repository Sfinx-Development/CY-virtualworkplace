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

        public UserController(JwtService jwtService, IUserService userService)
        {
            _jwtService = jwtService;
            _userService = userService;
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<User>> GetUserDTO()
        {
            try
            {
                Console.WriteLine("INNE I USER CONTROLLERN");

                var jwtCookie = Request.Cookies["jwttoken"];
                Request.Cookies.ToList().ForEach(c => Console.WriteLine("Cookie: " + c));

                if (jwtCookie != null)
                {
                    // Cookien existerar, logga ut värdet för felsökning
                    Console.WriteLine("JWT Cookie Value: " + jwtCookie);
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

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetById(string id)
        {
            try
            {
                User foundUser = await _userService.GetById(id);
                return foundUser;
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
                //KOLLA SÅ INTE SAMMA EMAIL SKAPAS TVÅ GÅNGER
                var userCreated = await _userService.Create(userCreateDto);

                if (userCreated == null)
                {
                    return BadRequest("Failed to create user.");
                }
                return Ok(userCreated);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Authorize]
        //DENNA TILLÅTER ATT VI KOMMER IN I METODEN
        [AllowAnonymous]
        [HttpPut]
        public async Task<ActionResult<User>> UpdateUser(User user)
        {
            try
            {
                var jwt = Request.Cookies["jwttoken"];

                if (string.IsNullOrWhiteSpace(jwt))
                {
                    return BadRequest("JWT token is missing.");
                }
                var loggedInUser = _jwtService.GetByJWT(jwt);

                if (loggedInUser == null)
                {
                    return BadRequest("JWT token is missing.");
                }

                User updatedUser = await _userService.Edit(user);
                return Ok(updatedUser);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpDelete]
        [Authorize]
        //DENNA TILLÅTER ATT VI KOMMER IN I METODEN
        [AllowAnonymous]
        public async Task<ActionResult<User>> DeleteUser(string id)
        {
            try
            {
                var jwt = Request.Cookies["jwttoken"];

                if (string.IsNullOrWhiteSpace(jwt))
                {
                    return BadRequest("JWT token is missing.");
                }
                var loggedInUser = _jwtService.GetByJWT(jwt);

                if (loggedInUser == null)
                {
                    return BadRequest("JWT token is missing.");
                }
                await _userService.DeleteById(id);
                return NoContent();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
