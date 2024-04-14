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
    public class ProjectController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly IProjectService _projectService;

        public ProjectController(JwtService jwtService, IProjectService projectService)
        {
            _jwtService = jwtService;
            _projectService = projectService;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<OutgoingProjectDTO>> Post([FromBody] ProjectDTO projectDTO)
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

                var projectCreated = await _projectService.CreateProjectAsync(
                    projectDTO,
                    loggedInUser
                );

                if (projectCreated == null)
                {
                    return BadRequest("Failed to create Project.");
                }
                return CreatedAtAction(
                    nameof(GetById),
                    new { id = projectCreated.Id },
                    projectCreated
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

                await _projectService.DeleteById(id, loggedInUser);

                return NoContent();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpPut]
        [Authorize]
        public async Task<ActionResult<OutgoingProjectDTO>> Update([FromBody] ProjectDTO projectDTO)
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
                    return BadRequest("JWT token is missing.");
                }

                OutgoingProjectDTO updatedProject = await _projectService.UpdateProject(
                    projectDTO,
                    loggedInUser
                );
                return Ok(updatedProject);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpGet("teamid/{teamid}")]
        [Authorize]
        public async Task<ActionResult<List<OutgoingProjectDTO>>> Get(string teamId)
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

                var projects = await _projectService.GetByTeam(teamId, loggedInUser);

                return Ok(projects);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        //varför skickar vi inte in teamId - även med healthchecks? tänk och se
        public async Task<ActionResult<OutgoingProjectDTO>> GetById(string id)
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

                var project = await _projectService.GetProjectBykId(id);

                return Ok(project);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
