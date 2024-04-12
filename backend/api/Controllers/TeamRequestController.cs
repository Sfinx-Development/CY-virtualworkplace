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

        [HttpGet]
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
                var teamRequests = await _requestService.GetTeamRequestsByUserId(loggedInUser.Id);
                return Ok(teamRequests);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpGet("teamId:string")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<TeamRequest>>> GetMyTeamRequests(string teamId)
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

        [HttpGet("id:string")]
        [Authorize]
        public async Task<ActionResult<TeamRequest>> GetById(string id)
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

        [HttpDelete("{id:string}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<TeamRequest>>> DeleteTeamRequest(string id)
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
