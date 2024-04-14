using core;
using Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly IProfileService _profileService;

        public ProfileController(JwtService jwtService, IProfileService profileService)
        {
            _jwtService = jwtService;
            _profileService = profileService;
        }

        [HttpGet("{teamid}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ProfileOutgoingDTO>>> GetProfilesByTeamId(
            string teamId
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
                var profiles = await _profileService.GetProfilesByTeamId(loggedInUser.Id, teamId);
                var profilesDtos = new List<ProfileOutgoingDTO>();

                profilesDtos = profiles
                    .Select(
                        p =>
                            new ProfileOutgoingDTO(
                                p.Id,
                                p.FullName,
                                p.Role,
                                p.IsOwner,
                                p.UserId,
                                p.TeamId,
                                p.DateCreated,
                                p.IsOnline,
                                p.LastOnline,
                                p.LastActive,
                                p.User.AvatarUrl
                            )
                    )
                    .ToList();

                return Ok(profilesDtos);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpGet("online/{teamid}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Profile>>> GetOnlineProfilesByTeamId(
            string teamId
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
                var profiles = await _profileService.GetOnlineProfilesByTeam(loggedInUser, teamId);
                profiles.ForEach(p => Console.WriteLine("ONLIINE: " + p.FullName));
                return Ok(profiles);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpGet("byauth/{teamid}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ProfileOutgoingDTO>>> GetProfileByAuthAndTeam(
            string teamId
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
                var profile = await _profileService.GetProfileByAuthAndTeam(loggedInUser, teamId);

                var profileOutgoingDTO = new ProfileOutgoingDTO(
                    profile.Id,
                    profile.FullName,
                    profile.Role,
                    profile.IsOwner,
                    profile.UserId,
                    profile.TeamId,
                    profile.DateCreated,
                    profile.IsOnline,
                    profile.LastOnline,
                    profile.LastActive,
                    profile.User.AvatarUrl
                );
                return Ok(profileOutgoingDTO);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [HttpPut]
        [Authorize]
        public async Task<ActionResult<Profile>> UpdateProfile(
            [FromBody] ProfileUpdateDTO profileUpdateDTO
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

                Console.WriteLine("LOGGED IN: ", loggedInUser.Id);

                if (loggedInUser == null)
                {
                    return BadRequest("JWT token is missing.");
                }

                if (profileUpdateDTO.UserId != loggedInUser.Id)
                {
                    return BadRequest("Profile doesn't belong to user.");
                }

                Profile updatedProfile = await _profileService.UpdateProfile(profileUpdateDTO);
                return Ok(updatedProfile);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Authorize]
        [HttpDelete("{profileid}")]
        public async Task<ActionResult> Delete(string profileId)
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

                var userProfiles = await _profileService.GetProfilesByUserId(loggedInUser);

                if (userProfiles == null || userProfiles.Count < 1)
                {
                    return BadRequest("User profile not found.");
                }

                // HÄR KOLLAR VI OM CANTLeavePROFILE ÄR SANN ELLER FALSK, RETURNERAR BAD REQUEST
                // OM DET ÄR EN OWNER

                var profileToDelete = userProfiles.Find(p => p.Id == profileId);

                if (profileToDelete == null)
                {
                    return BadRequest("User profile not found.");
                }

                try
                {
                    await _profileService.CantLeaveTeamIfOwner(profileToDelete);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }

                await _profileService.DeleteProfile(profileToDelete);

                return Ok("Successfully left the team.");
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
