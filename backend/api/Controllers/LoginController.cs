using System;
using System.Threading.Tasks;
using api;
using core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using services;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LogInController : ControllerBase
    {
        private readonly LogInService _logInService;

        public LogInController(LogInService logInService)
        {
            _logInService = logInService;
        }

        [HttpPost]
        public async Task<ActionResult<LogInDTO>> LogInUser([FromBody] LogInDTO logInDTO)
        {
            try
            {
                LogInDTO logInDTOWithJwt = _logInService.LogIn(logInDTO.Email, logInDTO.Password);
                return logInDTOWithJwt;
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
