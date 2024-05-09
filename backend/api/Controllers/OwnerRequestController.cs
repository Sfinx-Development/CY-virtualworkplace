using core;
using core.Migrations;
using Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OwnerRequestController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly IOwnerRequestService _requestService;

        public OwnerRequestController(JwtService jwtService, IOwnerRequestService requestService)
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

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<OwnerRequestDTO>> Post(
            [FromBody] OwnerRequestDTO ownerRequestDTO
        )
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();

                var requestCreated = await _requestService.CreateAsync(
                    ownerRequestDTO,
                    loggedInUser
                );

                return Ok(requestCreated);
                //return CreatedAtAction(nameof(GetById), new { id = teamCreated.Id }, teamCreated);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpGet("byprofile/{profileId}")]
        [Authorize]
        public async Task<ActionResult<OwnerRequestDTO>> GetMyOwnerRequest(string profileId)
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();
                var teamRequest = await _requestService.GetOwnerRequestByProfileId(profileId);
                return Ok(teamRequest);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpGet("{teamid}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<OwnerRequestDTO>>> GetUnconfirmedRequests(
            string teamId
        )
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();
                var teamRequests = await _requestService.GetUnconfirmedOwnerRequestsByTeamId(
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
        public async Task<ActionResult<OwnerRequestDTO>> GetById(string id)
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
        public async Task<ActionResult<IEnumerable<OwnerRequestDTO>>> UpdateOwnerRequest(
            [FromBody] OwnerRequestDTO ownerRequest
        )
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();
                var teamRequests = await _requestService.UpdateOwnerRequest(
                    ownerRequest,
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
        public async Task<ActionResult> DeleteOwnerRequest(string id)
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
