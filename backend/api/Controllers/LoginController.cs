using System;
using System.Threading.Tasks;
using api;
using core;
using Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LogInController : ControllerBase
    {
        private readonly ILoginService _logInService;

        public LogInController(ILoginService logInService)
        {
            _logInService = logInService;
        }

        [HttpPost]
        public async Task<ActionResult<LogInDTO>> LogInUser([FromBody] LogInDTONoJwt logInDTONoJwt)
        {
            try
            {
                LogInDTO logInDTOWithJwt = await _logInService.LogIn(
                    logInDTONoJwt.Email,
                    logInDTONoJwt.Password
                );

                //SKA SKICKAS SOM KAKA SEN
                //       Response.Cookies.Append("jwtToken", logInDTOWithJwt.JWT, new CookieOptions
                // {
                //     HttpOnly = true, // Förhindrar JavaScript från att komma åt cookien
                //     Secure = true,   // Kräver HTTPS för att skicka cookien (om det inte är lokal utveckling)
                //     SameSite = SameSiteMode.Strict // Skydd mot CSRF-attacker
                // });

                // return Ok(logInDTOWithJwt);

                return logInDTOWithJwt;
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
