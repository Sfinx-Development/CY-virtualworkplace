using System.Net;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using api;
using core;
using Interfaces;
using Microsoft.AspNetCore.Http;
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
        public async Task<ActionResult<LogInDTONoJwt>> LogInUser(
            [FromBody] LogInDTONoJwt logInDTONoJwt
        )
        {
            try
            {
                string jwt = await _logInService.LogIn(logInDTONoJwt.Email, logInDTONoJwt.Password);

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Expires = DateTime.Now.AddDays(14),
                    IsEssential = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Domain = null,
                    Path = "/"
                };

                Response.Cookies.Append("jwttoken", jwt, cookieOptions);

                return Ok();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpPost("logout")]
        public IActionResult LogOutUser()
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.Now.AddDays(-1),
                SameSite = SameSiteMode.None,
                Secure = true
            };

            Response.Cookies.Append("jwttoken", "", cookieOptions);

            return Ok();
        }
    }
}
