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
    public class ProfileHealthCheckController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly IProfileHealthCheckService _profileHealthCheckService;

        public ProfileHealthCheckController(
            JwtService jwtService,
            IProfileHealthCheckService profileHealthCheckService
        )
        {
            _jwtService = jwtService;
            _profileHealthCheckService = profileHealthCheckService;
        }

        [Authorize]
        [HttpPost("Create")]
        public async Task<ActionResult<ProfileHealthCheckDTO>> Post(
            [FromBody] ProfileHealthCheckDTO profileHealthCheck
        )
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

                var profileHCCreated = await _profileHealthCheckService.CreateAsync(
                    profileHealthCheck,
                    loggedInUser
                );

                if (profileHCCreated == null)
                {
                    return BadRequest("Failed to create profile health check.");
                }
                return profileHCCreated;
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

                await _profileHealthCheckService.DeleteByIdAsync(id, loggedInUser);

                return Ok("Successfully deleted HealthCheck.");
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpPut]
        [Authorize]
        public async Task<ActionResult<ProfileHealthCheckDTO>> Update(
            [FromBody] ProfileHealthCheckDTO profileHealthCheck
        )
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

                ProfileHealthCheckDTO updatedProfileHealth =
                    await _profileHealthCheckService.UpdateAsync(profileHealthCheck, loggedInUser);
                return Ok(updatedProfileHealth);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpPost("byhealthcheck")]
        [Authorize]
        public async Task<ActionResult<List<ProfileHealthCheckDTO>>> Get(
            [FromBody] string profileId
        )
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

                var profileHealthChecks = await _profileHealthCheckService.GetAllByHealthCheck(
                    profileId,
                    loggedInUser
                );

                return Ok(profileHealthChecks);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
