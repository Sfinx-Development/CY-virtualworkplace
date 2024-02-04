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
    public class ProfileController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly IProfileService _profileService;

        public ProfileController(JwtService jwtService, IProfileService profileService)
        {
            _jwtService = jwtService;
            _profileService = profileService;
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Profile>>> GetProfilesByTeamId(
            [FromBody] string teamId
        )
        {
            try
            {
                var jwtCookie = Request.Cookies["jwttoken"];

                if (string.IsNullOrWhiteSpace(jwtCookie))
                {
                    return BadRequest("JWT token is missing.");
                }
                var loggedInUser = await _jwtService.GetByJWT(jwtCookie);

                if (loggedInUser == null)
                {
                    return BadRequest("JWT token is missing.");
                }
                var profiles = await _profileService.GetProfilesByTeamId(loggedInUser.Id, teamId);

                return Ok(profiles);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpPost("byauth")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Profile>>> GetProfileByAuthAndTeam(
            [FromBody] string teamId
        )
        {
            try
            {
                var jwtCookie = Request.Cookies["jwttoken"];

                if (string.IsNullOrWhiteSpace(jwtCookie))
                {
                    return BadRequest("JWT token is missing.");
                }
                var loggedInUser = await _jwtService.GetByJWT(jwtCookie);

                if (loggedInUser == null)
                {
                    return BadRequest("JWT token is missing.");
                }
                var profile = await _profileService.GetProfileByAuthAndTeam(loggedInUser, teamId);

                return Ok(profile);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpPut]
        [Authorize]
        public async Task<ActionResult<Profile>> UpdateProfile(Profile profile)
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

                if (loggedInUser.Profiles.Any(p => p.Id == profile.Id))
                {
                    Profile updatedProfile = await _profileService.UpdateProfile(profile);
                    return Ok(updatedProfile);
                }
                else
                {
                    return BadRequest("Profile not found.");
                }
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Authorize]
        [HttpDelete]
        public async Task<ActionResult> Delete([FromBody] string profileId)
        {
            try
            {
                var jwt = HttpContext
                    .Request.Headers["Authorization"]
                    .ToString()
                    .Replace("Bearer ", string.Empty);
                if (string.IsNullOrWhiteSpace(jwt))
                {
                    return BadRequest("JWT token is missing.");
                }

                var loggedInUser = await _jwtService.GetByJWT(jwt);

                if (loggedInUser == null)
                {
                    return BadRequest("Failed to get user.");
                }

                var userProfiles = await _profileService.GetProfilesByUserId(loggedInUser);

                if (userProfiles == null || userProfiles.Count < 1)
                {
                    return BadRequest("User profile not found.");
                }

                // HÄR KOLLAR VI OM CANTLeavePROFILE ÄR SANN ELLER FALSK, RETURNERAR BAD REQUEST
                // OM DET ÄR EN OWNER

                var profileToDelete = userProfiles.Find(p => p.Id == profileId);

                if (profileToDelete == null)
                {
                    return BadRequest("User profile not found.");
                }

                try
                {
                    await _profileService.CantLeaveTeamIfOwner(profileToDelete);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }

                await _profileService.DeleteProfile(profileToDelete);

                return Ok("Successfully left the team.");
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
