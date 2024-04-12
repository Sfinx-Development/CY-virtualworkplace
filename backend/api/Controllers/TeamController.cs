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
    public class TeamController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly ITeamService _teamService;
        private readonly IProfileService _profileService;
        private readonly IConversationService _conversationService;
        private readonly IMeetingOccasionService _meetingOccasionService;

        public TeamController(
            JwtService jwtService,
            ITeamService teamService,
            IProfileService profileService,
            IConversationService conversationService,
            IMeetingOccasionService meetingOccasionService
        )
        {
            _jwtService = jwtService;
            _teamService = teamService;
            _profileService = profileService;
            _conversationService = conversationService;
            _meetingOccasionService = meetingOccasionService;
        }

        [Authorize]
        [HttpPost("Create")]
        public async Task<ActionResult<Team>> Post(
            [FromBody] IncomingCreateTeamDTO incomingCreateTeamDTO
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

                var teamCreated = await _teamService.CreateAsync(
                    incomingCreateTeamDTO,
                    loggedInUser
                );

                return Ok(teamCreated);
                // return CreatedAtAction(nameof(GetById), new { id = teamCreated.Id }, teamCreated);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Authorize]
        [HttpPost("Join")]
        public async Task<ActionResult<object>> Post([FromBody] JoinRequestDTO request)
        {
            //ATT GÖRA: kolla villkor så man inte kan gå med flera gånger i samma team
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
                var foundTeam = await _teamService.GetByCodeAsync(request.Code);

                if (foundTeam == null)
                {
                    return BadRequest("No team found.");
                }
                else
                {
                    var returnObject = await _teamService.JoinTeam(request, loggedInUser);
                    if (returnObject is Profile profile)
                    {
                        return Ok(profile.Team);
                    }
                    else
                    {
                        return Ok(returnObject);
                    }
                }
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Authorize]
        [HttpDelete]
        public async Task<ActionResult> Post([FromBody] DeleteTeamDTO deleteTeamDTO)
        {
            try
            {
                Console.WriteLine(deleteTeamDTO.TeamId + "PROFIL ID KOMMER HÄR");
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

                var profileToDelete = userProfiles.Find(p => p.Id == deleteTeamDTO.ProfileId);

                if (profileToDelete == null)
                {
                    return BadRequest("User profile not found.");
                }

                await _profileService.DeleteTeamAndProfiles(deleteTeamDTO);

                return Ok("Successfully left the team.");
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Team>>> GetMyTeams()
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
                var teams = await _teamService.GetTeamsByUserId(loggedInUser.Id);
                teams.ForEach(t => Console.WriteLine(t.Name));
                return Ok(teams);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpGet("teamrequests")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<TeamRequest>>> GetMyTeamRequests()
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
                var teamRequests = await _teamService.GetTeamRequestsByUserId(loggedInUser.Id);
                return Ok(teamRequests);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpPost("teamrequestsbyteam")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<TeamRequest>>> GetMyTeamRequests(
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
                var teamRequests = await _teamService.GetUnconfirmedTeamRequestsByTeamId(
                    teamId,
                    loggedInUser
                );
                return Ok(teamRequests);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpPost("teamrequestupdate")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<TeamRequest>>> UpdateTeamRequest(
            [FromBody] TeamRequest teamRequest
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
                var teamRequests = await _teamService.UpdateTeamRequest(teamRequest, loggedInUser);
                return Ok(teamRequests);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpPost("deleteteamrequest")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<TeamRequest>>> DeleteTeamRequest(
            [FromBody] string requestId
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
                await _teamService.DeleteRequest(requestId, loggedInUser);
                return Ok();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpPost("update")]
        [Authorize]
        public async Task<ActionResult<Team>> Update([FromBody] Team team)
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

                Team updatedTeam = await _teamService.UpdateTeam(team, loggedInUser);
                return Ok(updatedTeam);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}








//     [HttpPut]
//     [Authorize]
//     public async Task<ActionResult<User>> UpdateUser(User user)
//     {
//         try
//         {
//             var jwt = HttpContext
//                 .Request.Headers["Authorization"]
//                 .ToString()
//                 .Replace("Bearer ", string.Empty);

//             if (string.IsNullOrWhiteSpace(jwt))
//             {
//                 return BadRequest("JWT token is missing.");
//             }
//             var loggedInUser = _jwtService.GetByJWT(jwt);

//             if (loggedInUser == null)
//             {
//                 return BadRequest("JWT token is missing.");
//             }

//             User updatedUser = await _userService.Edit(user);
//             return Ok(updatedUser);
//         }
//         catch (Exception e)
//         {
//             return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
//         }
//     }

//     [HttpDelete]
//     [Authorize]
//     public async Task<ActionResult<User>> DeleteUser(string id)
//     {
//         try
//         {
//             var jwt = HttpContext
//                 .Request.Headers["Authorization"]
//                 .ToString()
//                 .Replace("Bearer ", string.Empty);

//             if (string.IsNullOrWhiteSpace(jwt))
//             {
//                 return BadRequest("JWT token is missing.");
//             }
//             var loggedInUser = _jwtService.GetByJWT(jwt);

//             if (loggedInUser == null)
//             {
//                 return BadRequest("JWT token is missing.");
//             }
//             await _userService.DeleteById(id);
//             return NoContent();
//         }
//         catch (Exception e)
//         {
//             return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
//         }
//     }
