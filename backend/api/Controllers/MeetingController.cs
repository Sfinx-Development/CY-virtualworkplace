using core;
using Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MeetingController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly IMeetingService _meetingService;

        public MeetingController(JwtService jwtService, IMeetingService meetingService)
        {
            _jwtService = jwtService;
            _meetingService = meetingService;
        }

        //detta ska vara sen när man kan skapa möten utan att hela teamet bjuds in automatiskt:

        // [Authorize]
        // [HttpPost]
        // public async Task<ActionResult<OutgoingMeetingDTO>> Post(
        //     [FromBody] CreateMeetingDTO incomingMeetingDTO
        // )
        // {
        //     try
        //     {
        //         var jwt = Request.Cookies["jwttoken"];
        //         if (string.IsNullOrWhiteSpace(jwt))
        //         {
        //             return BadRequest("JWT token is missing.");
        //         }
        //         var loggedInUser = await _jwtService.GetByJWT(jwt);

        //         if (loggedInUser == null)
        //         {
        //             return BadRequest("Failed to get user.");
        //         }

        //         //I CREATE MEETING ISERVICE SKA OCCASION OCKSÅ SKAPAS FÖR ÄGAREN AV MÖTET DIREKT
        //         if (loggedInUser.Profiles.Any(p => p.Id == incomingMeetingDTO.OwnerId))
        //         {
        //             var meetingCreated = await _meetingService.CreateAsync(incomingMeetingDTO);

        //             if (meetingCreated == null)
        //             {
        //                 return BadRequest("Failed to create meeting.");
        //             }
        //             return meetingCreated;
        //         }
        //         else
        //         {
        //             throw new Exception("The owner of meeting is not in line with the JWT bearer.");
        //         }
        //     }
        //     catch (Exception e)
        //     {
        //         return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
        //     }
        // }
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
        [HttpPost("team")]
        public async Task<ActionResult<OutgoingMeetingDTO>> PostTeamMeeting(
            [FromBody] CreateMeetingDTO incomingMeetingDTO
        )
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();

                var meetingCreated = await _meetingService.CreateTeamMeetingAsync(
                    incomingMeetingDTO,
                    loggedInUser
                );

                if (meetingCreated == null)
                {
                    return BadRequest("Failed to create team.");
                }

                return meetingCreated;
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

                await _meetingService.DeleteMeetingAndOccasions(id, loggedInUser.Id);

                return NoContent();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpPut]
        [Authorize]
        public async Task<ActionResult<OutgoingMeetingDTO>> Update(
            [FromBody] IncomingMeetingDTO meeting
        )
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();

                if (loggedInUser.Profiles.Any(p => p.Id == meeting.OwnerId))
                {
                    var updatedMeeting = await _meetingService.UpdateMeeting(meeting);
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

        [HttpGet("{profileid}")]
        [Authorize]
        public async Task<ActionResult<List<OutgoingMeetingDTO>>> Get(string profileId)
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();
                var meetings = await _meetingService.GetMeetingsByProfile(profileId, loggedInUser);

                return Ok(meetings);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
