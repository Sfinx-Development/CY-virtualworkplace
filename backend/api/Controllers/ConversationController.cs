using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;
using api;
using core;
using Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ConversationController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly ConversationService _conversationService;
        private readonly IProfileService _profileService;
       
             private readonly IUserService _userService;

        public ConversationController(JwtService jwtService, ConversationService conversationService, IProfileService profileService, IUserService userService)
        {
            _jwtService = jwtService;
            _conversationService = conversationService;
            _profileService = profileService;
            _userService = userService;
        }

  [Authorize]
[HttpPost("Create")]
public async Task<ActionResult<Conversation>> CreateConversation([FromBody]string teamId)
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

        // Skapa konversation
        var createdConversation = await _conversationService.CreateConversationAsync(loggedInUser.Id, teamId);
      
        return createdConversation;
    }
    catch (Exception e)
    {
        return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
    }
}






    //     [Authorize]
    //     [HttpDelete]
    //     public async Task<ActionResult> DeleteConversation([FromBody] DeleteConversationDTO deleteConversationDTO)
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

    //             var loggedInUser = await _jwtService.GetByJWT(jwt);

    //             if (loggedInUser == null)
    //             {
    //                 return BadRequest("Failed to get user.");
    //             }

            
    //             var conversationId = deleteConversationDTO.ConversationId;

    //             await _conversationService.DeleteByIdAsync(conversationId);

    //             return Ok("Successfully deleted conversation.");
    //         }
    //         catch (Exception e)
    //         {
    //             return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
    //         }
    //     }

    
     }
}
