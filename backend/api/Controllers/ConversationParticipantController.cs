using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;
using api;
using core;
using Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ConversationParticipantController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly IConversationParticipantService _conversationParticipantService;
        private readonly IProfileService _profileService;

        private readonly IUserService _userService;

        public ConversationParticipantController(
            JwtService jwtService,
            IConversationParticipantService conversationParticipantService,
            IProfileService profileService,
            IUserService userService
        )
        {
            _jwtService = jwtService;
            _conversationParticipantService = conversationParticipantService;
            _profileService = profileService;
            _userService = userService;
        }

        // [Authorize]
        // [HttpPost]
        // public async Task<ActionResult<ConversationParticipantDTO>> GetConversationParticipant(
        //     [FromBody] GetParticipantDTO getParticipantDTO
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
        //             return BadRequest("Failed to get user.");
        //         }

        //         var participant = await _conversationService.GetConversationParticipant(
        //             getParticipantDTO.ConversationId,
        //             getParticipantDTO.ProfileId,
        //             loggedInUser
        //         );
        //         var participantDTO = new ConversationParticipantDTO()
        //         {
        //             Id = participant.Id,
        //             ProfileId = participant.ProfileId,
        //             ConversationId = participant.ConversationId
        //         };

        //         Console.WriteLine("SKICKAS IVÄG: ", participantDTO);

        //         return Ok(participantDTO);
        //     }
        //     catch (Exception e)
        //     {
        //         return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
        //     }
        // }

        [Authorize]
        [HttpPut]
        public async Task<ActionResult<ConversationParticipantDTO>> Update(
            [FromBody] ConversationParticipantDTO conversationParticipantDTO
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
                var updatedConversationPart = await _conversationParticipantService.Update(
                    conversationParticipantDTO
                );
                var updatedDTO = new ConversationParticipantDTO(
                    updatedConversationPart.Id,
                    updatedConversationPart.ProfileId,
                    updatedConversationPart.ConversationId,
                    updatedConversationPart.LastActive
                );
                return Ok(updatedDTO);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
