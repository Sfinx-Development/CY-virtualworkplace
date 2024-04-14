using core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProjectUpdateController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly IProjectUpdateService _updateService;

        public ProjectUpdateController(JwtService jwtService, IProjectUpdateService updateService)
        {
            _jwtService = jwtService;
            _updateService = updateService;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<OutgoingUpdateDTO>> Post(
            [FromBody] ProjectUpdateDTO projectUpdateDTO
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

                var updateCreated = await _updateService.CreateAsync(
                    projectUpdateDTO,
                    loggedInUser
                );

                if (updateCreated == null)
                {
                    return BadRequest("Failed to create project update.");
                }

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = updateCreated.Id },
                    updateCreated
                );
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

                await _updateService.DeleteByIdAsync(id, loggedInUser);

                return NoContent();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        // [HttpPut]
        // [Authorize]
        // public async Task<ActionResult<UpdateCommentDTO>> Update(
        //     [FromBody] UpdateCommentDTO updateCommentDTO
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
        //             return BadRequest("JWT token is missing.");
        //         }

        //         UpdateCommentDTO updatedCommentDTO = await _updateService.UpdateAsync(
        //             updateCommentDTO,
        //             loggedInUser
        //         );
        //         return Ok(updatedCommentDTO);
        //     }
        //     catch (Exception e)
        //     {
        //         return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
        //     }
        // }

        [HttpGet("byproject/{projectid}")]
        [Authorize]
        public async Task<ActionResult<List<OutgoingUpdateDTO>>> Get(string projectId)
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

                var updates = await _updateService.GetAllByProject(projectId, loggedInUser);

                return Ok(updates);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<OutgoingUpdateDTO>> GetById(string id)
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
                //någon mer check så rätt person hämtar rätt project? denna ska inte användas förutom från detta projectet

                var projectUpdate = await _updateService.GetByIdAsync(id);

                return Ok(projectUpdate);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
