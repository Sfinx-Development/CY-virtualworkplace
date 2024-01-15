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
    public class MeetingController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly MeetingService _meetingService;

        public MeetingController(JwtService jwtService, MeetingService meetingService)
        {
            _jwtService = jwtService;
            _meetingService = meetingService;
        }

        [Authorize]
        [HttpPost("Create")]
        public async Task<ActionResult<Meeting>> Post(IncomingMeetingDTO incomingMeetingDTO)
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

                //I CREATE MEETING ISERVICE SKA OCCASION OCKSÅ SKAPAS FÖR ÄGAREN AV MÖTET DIREKT
                if (loggedInUser.Profiles.Any(p => p.Id == incomingMeetingDTO.OwnerId))
                {
                    var meetingCreated = await _meetingService.CreateAsync(incomingMeetingDTO);

                    if (meetingCreated == null)
                    {
                        return BadRequest("Failed to create team.");
                    }
                    return meetingCreated;
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

        [Authorize]
        [HttpDelete]
        public async Task<ActionResult> Delete([FromBody] DeleteMeetingDTO deleteMeetingDTO)
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

                await _meetingService.DeleteMeetingAndOccasions(deleteMeetingDTO);

                return Ok("Successfully deleted meeting.");
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpPut]
        [Authorize]
        public async Task<ActionResult<Meeting>> Update(Meeting meeting)
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
                    return BadRequest("JWT token is missing.");
                }

                if (loggedInUser.Profiles.Any(p => p.Id == meeting.OwnerId))
                {
                    Meeting updatedMeeting = await _meetingService.UpdateMeeting(meeting);
                    return Ok(updatedMeeting);
                }
                else
                {
                    return BadRequest("Profile not owner of meeting.");
                }
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
