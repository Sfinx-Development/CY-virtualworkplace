using core;
using Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TeamRequestController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly ITeamRequestService _requestService;

        public TeamRequestController(JwtService jwtService, ITeamRequestService requestService)
        {
            _jwtService = jwtService;
            _requestService = requestService;
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

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<TeamRequest>>> GetMyTeamRequests()
        {
            try
            {
                   var loggedInUser = await GetLoggedInUserAsync();
                var teamRequests = await _requestService.GetTeamRequestsByUserId(loggedInUser.Id);
                return Ok(teamRequests);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpGet("{teamid}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<TeamRequest>>> GetMyTeamRequests(string teamId)
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();
                var teamRequests = await _requestService.GetUnconfirmedTeamRequestsByTeamId(
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

        [HttpGet("id")]
        [Authorize]
        public async Task<ActionResult<TeamRequest>> GetById(string id)
        {
            try
            {
                  var loggedInUser = await GetLoggedInUserAsync();
                var teamRequest = await _requestService.GetById(id);
                return Ok(teamRequest);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpPut]
        [Authorize]
        public async Task<ActionResult<IEnumerable<TeamRequest>>> UpdateTeamRequest(
            [FromBody] TeamRequest teamRequest
        )
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();
                var teamRequests = await _requestService.UpdateTeamRequest(
                    teamRequest,
                    loggedInUser
                );
                return Ok(teamRequests);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<TeamRequest>>> DeleteTeamRequest(string id)
        {
            try
            {
                 var loggedInUser = await GetLoggedInUserAsync();
                await _requestService.DeleteRequest(id, loggedInUser);
                return NoContent();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
