using core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProfileSurveyController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly IProfileSurveyService _profileSurveyService;

        public ProfileSurveyController(
            JwtService jwtService,
            IProfileSurveyService profileSurveyService
        )
        {
            _jwtService = jwtService;
            _profileSurveyService = profileSurveyService;
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
        public async Task<ActionResult<ProfileSurveyDTO>> Post(
            [FromBody] ProfileSurveyDTO profileSurvey
        )
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();

                var profileHCCreated = await _profileSurveyService.CreateAsync(
                    profileSurvey,
                    loggedInUser
                );

                if (profileHCCreated == null)
                {
                    return BadRequest("Failed to create profile health check.");
                }
                return profileHCCreated;
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

                await _profileSurveyService.DeleteByIdAsync(id, loggedInUser);

                return Ok("Successfully deleted Survey.");
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpPut]
        [Authorize]
        public async Task<ActionResult<ProfileSurveyDTO>> Update(
            [FromBody] ProfileSurveyDTO profileSurvey
        )
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();

                ProfileSurveyDTO updatedProfileSurvey = await _profileSurveyService.UpdateAsync(
                    profileSurvey,
                    loggedInUser
                );
                return Ok(updatedProfileSurvey);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpGet("byid/{surveyid}")]
        [Authorize]
        public async Task<ActionResult<List<ProfileSurveyDTO>>> Get(string surveyId)
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();

                var profileSurveys = await _profileSurveyService.GetAllBySurvey(
                    surveyId,
                    loggedInUser
                );

                return Ok(profileSurveys);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpGet("byprofile/{profileid}")]
        [Authorize]
        public async Task<ActionResult<List<ProfileSurveyDTO>>> GetByProfile(string profileId)
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();
                var profileSurveys = await _profileSurveyService.GetAllByProfileId(
                    profileId,
                    loggedInUser
                );

                return Ok(profileSurveys);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
