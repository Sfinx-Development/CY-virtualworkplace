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
        private readonly IMeetingService _meetingService;
        private readonly IMeetingRoomService _meetingRoomService;

        public MeetingController(
            JwtService jwtService,
            IMeetingService meetingService,
            IMeetingRoomService meetingRoomService
        )
        {
            _jwtService = jwtService;
            _meetingService = meetingService;
            _meetingRoomService = meetingRoomService;
        }

        [Authorize]
        [HttpPost("Create")]
        public async Task<ActionResult<Meeting>> Post(
            [FromBody] CreateMeetingDTO incomingMeetingDTO
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
[HttpPost("CreateTeamMeeting")]
public async Task<ActionResult<Meeting>> PostTeamMeeting(
    [FromBody] CreateMeetingDTO incomingMeetingDTO
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

        // Kontrollera överlappande möten
        // var overlappingMeetings = await _meetingService.GetTeamMeetingsInPeriodAsync(
        //     incomingMeetingDTO.TeamId,
        //     incomingMeetingDTO.Date,
        //     incomingMeetingDTO.Date.AddMinutes(incomingMeetingDTO.Minutes)
        // );

        // if (overlappingMeetings.Count > 0)
        // {
        //     return BadRequest("There are overlapping meetings for the team in the specified time period.");
        // }

        if (loggedInUser.Profiles.Any(p => p.Id == incomingMeetingDTO.OwnerId))
        {
            var meetingCreated = await _meetingService.CreateTeamMeetingAsync(incomingMeetingDTO);

            if (meetingCreated == null)
            {
                return BadRequest("Failed to create team.");
            }

            return meetingCreated;
        }
        else
        {
            throw new Exception("The owner of the meeting is not in line with the JWT bearer.");
        }
    }
    catch (Exception e)
    {
        return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
    }
}


        [HttpPost("meetingroom")]
        [Authorize]
        public async Task<ActionResult<MeetingRoom>> Getmeetingroombyteamid(
            [FromBody] string teamId
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

                MeetingRoom meetingRoom = await _meetingRoomService.GetMeetingRoomByTeamId(teamId);
                return Ok(meetingRoom);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Authorize]
        [HttpDelete]
        public async Task<ActionResult> Delete([FromBody] string meetingId)
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

                await _meetingService.DeleteMeetingAndOccasions(meetingId, loggedInUser.Id);

                return Ok("Successfully deleted meeting.");
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpPut]
        [Authorize]
        public async Task<ActionResult<Meeting>> Update([FromBody] IncomingMeetingDTO meeting)
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

                if (loggedInUser.Profiles.Any(p => p.Id == meeting.OwnerId))
                {
                    Console.WriteLine(
                        ".------------------------------möte kommer in: " + meeting.Date
                    );
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

        [HttpPost("allmeetings")]
        [Authorize]
        public async Task<ActionResult<List<OutgoingMeetingDTO>>> Get([FromBody] string profileId)
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

                var meetings = await _meetingService.GetMeetingsByProfile(profileId, loggedInUser);
                var outgoingMeetings = new List<OutgoingMeetingDTO>();
                outgoingMeetings = meetings
                    .Select(
                        m =>
                            new OutgoingMeetingDTO(
                                m.Id,
                                m.Name,
                                m.Description,
                                m.Date,
                                m.Minutes,
                                m.IsRepeating,
                                m.RoomId,
                                m.OwnerId,
                                m.Interval,
                                m.EndDate
                            )
                    )
                    .ToList();
                return Ok(outgoingMeetings);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
