using System;
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
    public class MessageController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly MessageService _messageService;

        public MessageController(JwtService jwtService, MessageService messageService)
        {
            _jwtService = jwtService;
            _messageService = messageService;
        }

        [Authorize]
        [HttpPost("Send")]
        public async Task<ActionResult<Message>> SendMessage(IncomingMessageDTO incomingMessageDTO)
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

                // Your authorization logic based on the user can be added here if needed

                var message = new Message
                {
                    // Populate Message properties from incomingMessageDTO or other sources
                };

                var createdMessage = await _messageService.Create(message);

                if (createdMessage == null)
                {
                    return BadRequest("Failed to send message.");
                }

                return createdMessage;
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

//         [Authorize]
// [HttpDelete]
// public async Task<ActionResult> DeleteMessage([FromBody] DeleteMessageDTO deleteMessageDTO)
// {
//     try
//     {
//         var jwt = HttpContext
//             .Request.Headers["Authorization"]
//             .ToString()
//             .Replace("Bearer ", string.Empty);

//         if (string.IsNullOrWhiteSpace(jwt))
//         {
//             return BadRequest("JWT token is missing.");
//         }

//         var loggedInUser = await _jwtService.GetByJWT(jwt);

//         if (loggedInUser == null)
//         {
//             return BadRequest("Failed to get user.");
//         }

//         // Your authorization logic based on the user can be added here if needed

//         // Extract necessary information from deleteMessageDTO
//         var conversationId = deleteMessageDTO.ConversationId;
//         var messageId = deleteMessageDTO.MessageId;

//         var conversation = new Conversation
//         {
//             Id = conversationId // Populate Conversation properties from deleteMessageDTO or other sources
//         };

//         var message = new Message
//         {
//             Id = messageId // Populate Message properties from deleteMessageDTO or other sources
//         };

//         await _messageService.RemoveConversationAndMessages(conversation, message);

//         return Ok("Successfully deleted message.");
//     }
//     catch (Exception e)
//     {
//         return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
//     }
// }
    }
}
