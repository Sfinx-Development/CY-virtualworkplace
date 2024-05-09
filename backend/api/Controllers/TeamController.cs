using core;
using Interfaces;
using Microsoft.AspNetCore.Authorization;
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

        public TeamController(
            JwtService jwtService,
            ITeamService teamService,
            IProfileService profileService
        )
        {
            _jwtService = jwtService;
            _teamService = teamService;
            _profileService = profileService;
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
        public async Task<ActionResult<Team>> Post(
            [FromBody] IncomingCreateTeamDTO incomingCreateTeamDTO
        )
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();

                var teamCreated = await _teamService.CreateAsync(
                    incomingCreateTeamDTO,
                    loggedInUser
                );

                return Ok(teamCreated);
                //return CreatedAtAction(nameof(GetById), new { id = teamCreated.Id }, teamCreated);
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
                var loggedInUser = await GetLoggedInUserAsync();
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
        [HttpDelete("{teamId}")]
        public async Task<ActionResult> Post(string teamId)
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();
                // FLYTTA LOGIKEN IN I SERVICE KLASSEN :) :

                // var userProfiles = await _profileService.GetProfilesByUserId(loggedInUser);

                // if (userProfiles == null || userProfiles.Count < 1)
                // {
                //     return BadRequest("User profile not found.");
                // }

                // var profileToDelete = userProfiles.Find(p => p.Id == deleteTeamDTO.ProfileId);

                // if (profileToDelete == null)
                // {
                //     return BadRequest("User profile not found.");
                // }

                await _profileService.DeleteTeamAndProfiles(teamId, loggedInUser);

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
                var loggedInUser = await GetLoggedInUserAsync();
                var teams = await _teamService.GetTeamsByUserId(loggedInUser.Id);
                teams.ForEach(t => Console.WriteLine(t.Name));
                return Ok(teams);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpPut]
        [Authorize]
        public async Task<ActionResult<Team>> Update([FromBody] Team team)
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();

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
