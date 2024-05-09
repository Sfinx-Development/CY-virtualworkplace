using core;
using Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MessageController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly IMessageService _messageService;

        public MessageController(JwtService jwtService, IMessageService messageService)
        {
            _jwtService = jwtService;
            _messageService = messageService;
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
        public async Task<ActionResult<OutgoingMessageDTO>> CreateMessage(
            [FromBody] IncomingMessageDTO incomingMessageDTO
        )
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();

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
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(string id)
        {
            try
            {
              var loggedInUser = await GetLoggedInUserAsync();

                await _messageService.DeleteAsync(id, loggedInUser);
                // var chatHub = new ChatHub(_chatHubContext);
                // await chatHub.MessageDeleted(messageId);

                return NoContent();
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
               var loggedInUser = await GetLoggedInUserAsync();

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
