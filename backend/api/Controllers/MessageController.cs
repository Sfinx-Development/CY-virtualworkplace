using System;
using System.Threading.Tasks;
using api;
using core;
using Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MessageController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly IMessageService _messageService;
        private readonly IConversationService _conversationService;

        public MessageController(
            JwtService jwtService,
            IMessageService messageService,
            IConversationService conversationService
        )
        {
            _jwtService = jwtService;
            _messageService = messageService;
            _conversationService = conversationService;
        }

        [Authorize]
        [HttpPost("Send")]
        public async Task<ActionResult<OutgoingMessageDTO>> CreateMessage(
            IncomingMessageDTO incomingMessageDTO
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

                var createdMessage = await _messageService.CreateMessageInConversation(
                    incomingMessageDTO,
                    loggedInUser.Id
                );

                if (createdMessage == null)
                {
                    return BadRequest("Failed to send message.");
                }

                var outgoingMessageDTO = new OutgoingMessageDTO(
                    createdMessage.Id,
                    createdMessage.Content,
                    createdMessage.DateCreated,
                    createdMessage.ConversationParticipantId,
                    createdMessage.ConversationId,
                    createdMessage.ConversationParticipant.FullName,
                    createdMessage.ConversationParticipant.ProfileId
                );

                // var chatHub = new ChatHub(_chatHubContext);
                // await chatHub.MessageSent(outgoingMessageDTO);

                return outgoingMessageDTO;
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        // [Authorize]
        // [HttpPost("GetMessagesInConversation")]
        // public async Task<ActionResult<IEnumerable<Message>>> GetMessagesInConversation(
        //     [FromBody] string conversationParticipantId
        // )
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

        //         var messages = await _conversationService.GetConversationWithAllMessages(
        //             conversationParticipantId,
        //             loggedInUser
        //         );

        //         if (messages == null || !messages.Any())
        //         {
        //             return NotFound("No messages found in the conversation.");
        //         }

        //         return Ok(messages);
        //     }
        //     catch (Exception e)
        //     {
        //         return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
        //     }
        // }

        [Authorize]
        [HttpDelete]
        public async Task<ActionResult> DeleteMessage([FromBody] string messageId)
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

                await _messageService.DeleteAsync(messageId, loggedInUser);
                // var chatHub = new ChatHub(_chatHubContext);
                // await chatHub.MessageDeleted(messageId);

                return Ok();
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<ActionResult<OutgoingMessageDTO>> EditMessage(
            [FromBody] IncomingMessageDTO incomingMessageDTO
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

                var editedMessage = await _messageService.EditAsync(
                    incomingMessageDTO,
                    loggedInUser
                );

                var outgoingMessageDTO = new OutgoingMessageDTO(
                    editedMessage.Id,
                    editedMessage.Content,
                    editedMessage.DateCreated,
                    editedMessage.ConversationParticipantId,
                    editedMessage.ConversationId,
                    editedMessage.ConversationParticipant.FullName,
                    editedMessage.ConversationParticipant.ProfileId
                );
                // var chatHub = new ChatHub(_chatHubContext);
                // await chatHub.MessageEdited(outgoingMessageDTO);
                return Ok(editedMessage);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
