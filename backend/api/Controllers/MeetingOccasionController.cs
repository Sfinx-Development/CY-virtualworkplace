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
    public class MeetingOccasionController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly IMeetingOccasionService _meetingOccasionService;

        public MeetingOccasionController(
            JwtService jwtService,
            IMeetingOccasionService meetingOccasionService
        )
        {
            _jwtService = jwtService;
            _meetingOccasionService = meetingOccasionService;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<MeetingOccasion>>> Get(string profileId)
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

                if (loggedInUser.Profiles.Any(p => p.Id == profileId))
                {
                    var meetingOccasions = await _meetingOccasionService.GetOccasionsByProfileId(
                        profileId
                    );

                    return Ok(meetingOccasions);
                }
                else
                {
                    throw new Exception("The owner of meeting is not in line with the JWT bearer.");
                }
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
