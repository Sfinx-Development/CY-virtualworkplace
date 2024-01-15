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
        public async Task<ActionResult<LogInDTO>> LogInUser([FromBody] LogInDTO logInDTO)
        {
            try
            {
                LogInDTO logInDTOWithJwt = await _logInService.LogIn(
                    logInDTO.Email,
                    logInDTO.Password
                );
                return logInDTOWithJwt;
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
