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
    public class HealthCheckController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly IHealthCheckService _healthCheckService;

        public HealthCheckController(JwtService jwtService, IHealthCheckService healthCheckService)
        {
            _jwtService = jwtService;
            _healthCheckService = healthCheckService;
        }

        [Authorize]
        [HttpPost("Create")]
        public async Task<ActionResult<HealthCheck>> Post([FromBody] HealthCheckDTO healthCheck)
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

                var healthCheckCreated = await _healthCheckService.CreateHealthCheckAsync(
                    healthCheck,
                    loggedInUser
                );

                if (healthCheckCreated == null)
                {
                    return BadRequest("Failed to create healthcheck.");
                }
                return healthCheckCreated;
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Authorize]
        [HttpDelete]
        public async Task<ActionResult> Delete([FromBody] string id)
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

                await _healthCheckService.DeleteById(id, loggedInUser);

                return Ok("Successfully deleted HealthCheck.");
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpPut]
        [Authorize]
        public async Task<ActionResult<HealthCheck>> Update([FromBody] HealthCheckDTO healthCheck)
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

                HealthCheck updatedHealthCheck = await _healthCheckService.UpdateHealthCheck(
                    healthCheck,
                    loggedInUser
                );
                return Ok(updatedHealthCheck);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        //hämta alla by teamet på profilid samt som gäller för nutiden
        [HttpPost("byteam")]
        [Authorize]
        public async Task<ActionResult<List<HealthCheck>>> Get([FromBody] string profileId)
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

                var healthChecks = await _healthCheckService.GetByTeam(profileId, loggedInUser);

                return Ok(healthChecks);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
