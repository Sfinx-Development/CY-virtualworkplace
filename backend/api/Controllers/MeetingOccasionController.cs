using core;
using Microsoft.AspNetCore.Authorization;
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
        [HttpGet("{profileid}")]
        public async Task<ActionResult<List<OutgoingOcassionDTO>>> Get(string profileId)
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();

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

        [Authorize]
        [HttpGet("past/{profileid}")]
        //när vi hämtar alla ens KOMMANDE mötestillfällen så uppdateras mötet till senaste tiden om återkommande
        public async Task<ActionResult<List<OutgoingOcassionDTO>>> GetPast(string profileId)
        {
            try
            {
                 var loggedInUser = await GetLoggedInUserAsync();

                if (loggedInUser.Profiles.Any(p => p.Id == profileId))
                {
                    var meetingOccasions =
                        await _meetingOccasionService.GetPastOccasionsByProfileId(profileId);

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

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            try
            {
                 var loggedInUser = await GetLoggedInUserAsync();
                await _meetingOccasionService.DeleteOccasion(id, loggedInUser.Id);

                return Ok("Deleted meeting occasion.");
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Authorize]
        [HttpPost]
        //ägaren kan lägga till någon till mötestillfället
        public async Task<ActionResult<OutgoingOcassionDTO>> Post(
            [FromBody] AddToMeetingDTO addToMeetingDTO
        )
        {
            try
            {

                 var loggedInUser = await GetLoggedInUserAsync();
                // var jwt = HttpContext
                //     .Request.Headers["Authorization"]
                //     .ToString()
                //     .Replace("Bearer ", string.Empty);

                // if (string.IsNullOrWhiteSpace(jwt))
                // {
                //     return BadRequest("JWT token is missing.");
                // }
                // var loggedInUser = await _jwtService.GetByJWT(jwt);

                // if (loggedInUser == null)
                // {
                //     return BadRequest("Failed to get user.");
                // }

                var occasionCreated = await _meetingOccasionService.AddOccasion(
                    addToMeetingDTO,
                    loggedInUser.Id
                );

                return Ok(occasionCreated);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
