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
    public class UpdateCommentController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly IUpdateCommentService _updateCommentService;

        public UpdateCommentController(
            JwtService jwtService,
            IUpdateCommentService updateCommentService
        )
        {
            _jwtService = jwtService;
            _updateCommentService = updateCommentService;
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
            [FromBody] UpdateCommentDTO updateCommentDTO
        )
        {
            try
            {
                 var loggedInUser = await GetLoggedInUserAsync();

                var updateComment = await _updateCommentService.CreateAsync(
                    updateCommentDTO,
                    loggedInUser
                );

                if (updateComment == null)
                {
                    return BadRequest("Failed to create update comment.");
                }
                return CreatedAtAction(
                    nameof(GetById),
                    new { id = updateComment.Id },
                    updateComment
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
               var loggedInUser = await GetLoggedInUserAsync();

                await _updateCommentService.DeleteByIdAsync(id, loggedInUser);

                return NoContent();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpPut]
        [Authorize]
        public async Task<ActionResult<ProfileSurveyDTO>> Update(
            [FromBody] UpdateCommentDTO updateCommentDTO
        )
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();

                var updateComment = await _updateCommentService.UpdateAsync(
                    updateCommentDTO,
                    loggedInUser
                );
                return Ok(updateComment);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpGet("byprojectupdate/{projectupdateid}")]
        [Authorize]
        public async Task<ActionResult<List<UpdateCommentDTO>>> Get(string projectUpdateId)
        {
            try
            {
              var loggedInUser = await GetLoggedInUserAsync();

                var updateComments = await _updateCommentService.GetAllByProjectUpdate(
                    projectUpdateId,
                    loggedInUser
                );

                return Ok(updateComments);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<UpdateCommentDTO>> GetById(string id)
        {
            try
            {
               var loggedInUser = await GetLoggedInUserAsync();
                //någon mer check så rätt person hämtar rätt project? denna ska inte användas förutom från detta projectet

                var updateComment = await _updateCommentService.GetByIdAsync(id);

                return Ok(updateComment);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
