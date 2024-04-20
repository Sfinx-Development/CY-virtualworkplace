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
        public async Task<ActionResult<HealthCheck>> Post([FromBody] HealthCheckDTO healthCheck)
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();

                var healthCheckCreated = await _healthCheckService.CreateHealthCheckAsync(
                    healthCheck,
                    loggedInUser
                );

                if (healthCheckCreated == null)
                {
                    return BadRequest("Failed to create healthcheck.");
                }
                return Ok(healthCheckCreated);
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

                await _healthCheckService.DeleteById(id, loggedInUser);

                return NoContent();
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
                var loggedInUser = await GetLoggedInUserAsync();

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
        [HttpGet("{profileid}")]
        [Authorize]
        public async Task<ActionResult<List<HealthCheckDTO>>> Get(string profileId)
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();

                var healthChecks = await _healthCheckService.GetByTeam(profileId, loggedInUser);

                var healthCheckDTOs = new List<HealthCheckDTO>();

                healthCheckDTOs = healthChecks
                    .Select(
                        h => new HealthCheckDTO(h.Id, h.TeamId, h.Question, h.StartTime, h.EndTime)
                    )
                    .OrderBy(h => h.StartTime)
                    .ToList();

                return Ok(healthCheckDTOs);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
