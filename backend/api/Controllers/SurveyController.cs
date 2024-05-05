using core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SurveyController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly ISurveyService _surveyService;

        public SurveyController(JwtService jwtService, ISurveyService surveyService)
        {
            _jwtService = jwtService;
            _surveyService = surveyService;
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
        public async Task<ActionResult<Survey>> Post([FromBody] SurveyDTO survey)
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();

                var SurveyCreated = await _surveyService.CreateSurveyAsync(
                    survey,
                    loggedInUser
                );

                if (SurveyCreated == null)
                {
                    return BadRequest("Failed to create survey.");
                }
                return Ok(SurveyCreated);
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

                await _surveyService.DeleteById(id, loggedInUser);

                return NoContent();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpPut]
        [Authorize]
        public async Task<ActionResult<Survey>> Update([FromBody] SurveyDTO survey)
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();

                Survey updatedSurvey = await _surveyService.UpdateSurvey(
                    survey,
                    loggedInUser
                );
                return Ok(updatedSurvey);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        //hämta alla by teamet på profilid samt som gäller för nutiden
        [HttpGet("{profileid}")]
        [Authorize]
        public async Task<ActionResult<List<SurveyDTO>>> Get(string profileId)
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();

                var Surveys = await _surveyService.GetByTeam(profileId, loggedInUser);

                var SurveyDTOs = new List<SurveyDTO>();

                SurveyDTOs = Surveys
                    .Select(
                        h => new SurveyDTO(h.Id, h.TeamId, h.Question, h.StartTime, h.EndTime)
                    )
                    .OrderBy(h => h.StartTime)
                    .ToList();

                return Ok(SurveyDTOs);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
