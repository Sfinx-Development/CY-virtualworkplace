using System;
using System.Security.Permissions;
using System.Threading.Tasks;
using api;
using core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TeamController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly TeamService _teamService;
        private readonly ProfileService _profileService;

        public TeamController(
            JwtService jwtService,
            TeamService teamService,
            ProfileService profileService
        )
        {
            _jwtService = jwtService;
            _teamService = teamService;
            _profileService = profileService;
        }

        // [HttpGet]
        // public async Task<ActionResult<User>> GetById(string id)
        // {
        //     try
        //     {
        //         User foundUser = await _userService.GetById(id);
        //         return foundUser;
        //     }
        //     catch (Exception e)
        //     {
        //         return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
        //     }
        // }

        [Authorize]
        [HttpPost("Create")]
        public async Task<ActionResult<Profile>> Post(IncomingCreateTeamDTO incomingCreateTeamDTO)
        {
            try
            {
                var jwt = HttpContext
                    .Request.Headers["Authorization"]
                    .ToString()
                    .Replace("Bearer ", string.Empty);

                if (string.IsNullOrWhiteSpace(jwt))
                {
                    return BadRequest("JWT token is missing.");
                }
                var loggedInUser = await _jwtService.GetByJWT(jwt);

                if (loggedInUser == null)
                {
                    return BadRequest("Failed to get user.");
                }

                var teamCreated = await _teamService.CreateAsync(incomingCreateTeamDTO);

                if (teamCreated == null)
                {
                    return BadRequest("Failed to create team.");
                }
                else
                {
                    Profile createdProfile = await _profileService.CreateProfile(
                        loggedInUser,
                        true,
                        incomingCreateTeamDTO.ProfileRole,
                        teamCreated
                    );
                    return createdProfile;
                }
                // return CreatedAtAction(nameof(GetById), new { id = teamCreated.Id }, teamCreated);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Authorize]
        [HttpPost("Join")]
        public async Task<ActionResult<Profile>> Post([FromBody] JoinRequestDTO request)
        {
            //ATT GÖRA: kolla villkor så man inte kan gå med flera gånger i samma team

            try
            {
                var jwt = HttpContext
                    .Request.Headers["Authorization"]
                    .ToString()
                    .Replace("Bearer ", string.Empty);

                if (string.IsNullOrWhiteSpace(jwt))
                {
                    return BadRequest("JWT token is missing.");
                }
                var loggedInUser = await _jwtService.GetByJWT(jwt);

                if (loggedInUser == null)
                {
                    return BadRequest("Failed to get user.");
                }
                var foundTeam = await _teamService.GetByCodeAsync(request.Code);

                if (foundTeam == null)
                {
                    return BadRequest("No team found.");
                }
                else
                {
                    var createdProfile = await _profileService.CreateProfile(
                        loggedInUser,
                        false,
                        request.Role,
                        foundTeam
                    );
                    // return CreatedAtAction(nameof(GetById), new { id = teamCreated.Id }, teamCreated);
                    return createdProfile;
                }
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Authorize]
        [HttpPost("Leave")]

        public async Task<ActionResult> Post([FromBody] LeaveRequestDTO request )
        {
            try
            {
                var jwt = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
                if (string.IsNullOrWhiteSpace(jwt))
                {
                    return BadRequest("JWT token is missing.");
                }

                var loggedInUser = await _jwtService.GetByJWT(jwt);

                if (loggedInUser == null)
                {
                    return BadRequest("Failed to get user.");
                }

               
                var userProfile = await _profileService.GetProfileByUserId(loggedInUser);

                if (userProfile == null)
                {
                    return BadRequest("User profile not found.");
                }

            
                if (userProfile.Team == null)
                {
                    return BadRequest("User is not a member of any team.");
                }

              
                await _profileService.DeleteProfile(userProfile);

                return Ok("Successfully left the team.");
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    
    }
}

   

    

       


        //     [HttpPut]
        //     [Authorize]
        //     public async Task<ActionResult<User>> UpdateUser(User user)
        //     {
        //         try
        //         {
        //             var jwt = HttpContext
        //                 .Request.Headers["Authorization"]
        //                 .ToString()
        //                 .Replace("Bearer ", string.Empty);

        //             if (string.IsNullOrWhiteSpace(jwt))
        //             {
        //                 return BadRequest("JWT token is missing.");
        //             }
        //             var loggedInUser = _jwtService.GetByJWT(jwt);

        //             if (loggedInUser == null)
        //             {
        //                 return BadRequest("JWT token is missing.");
        //             }

        //             User updatedUser = await _userService.Edit(user);
        //             return Ok(updatedUser);
        //         }
        //         catch (Exception e)
        //         {
        //             return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
        //         }
        //     }

        //     [HttpDelete]
        //     [Authorize]
        //     public async Task<ActionResult<User>> DeleteUser(string id)
        //     {
        //         try
        //         {
        //             var jwt = HttpContext
        //                 .Request.Headers["Authorization"]
        //                 .ToString()
        //                 .Replace("Bearer ", string.Empty);

        //             if (string.IsNullOrWhiteSpace(jwt))
        //             {
        //                 return BadRequest("JWT token is missing.");
        //             }
        //             var loggedInUser = _jwtService.GetByJWT(jwt);

        //             if (loggedInUser == null)
        //             {
        //                 return BadRequest("JWT token is missing.");
        //             }
        //             await _userService.DeleteById(id);
        //             return NoContent();
        //         }
        //         catch (Exception e)
        //         {
        //             return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
        //         }
        //     }
