using core;
using Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ConversationController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly IConversationService _conversationService;

        public ConversationController(
            JwtService jwtService,
            IConversationService conversationService
        )
        {
            _jwtService = jwtService;
            _conversationService = conversationService;
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
        public async Task<ActionResult<Conversation>> CreateConversation([FromBody] string teamId)
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();

                var createdConversation = await _conversationService.CreateTeamConversationAsync(
                    loggedInUser.Id,
                    teamId
                );

                return createdConversation;
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Authorize]
        [HttpPost("AddProfileToConversation")]
        public async Task<ActionResult<Conversation>> AddProfileToConversation(
            [FromBody] AddProfileToConversationDTO addProfileToConversationDTO
        )
        {
            try
            {
                // är loggedinuser ett userId i en av conversationparticipantsprofilerna för denna
                //konversation så ska profil läggas till i conversation
                //HÄÄÄR
              var loggedInUser = await GetLoggedInUserAsync();

                var addedProfile = await _conversationService.ManualAddProfileToConversationAsync(
                    addProfileToConversationDTO.ConversationParticipantId,
                    addProfileToConversationDTO.ProfileId
                );

                if (addedProfile == null)
                {
                    return BadRequest("Failed to add profile to conversation.");
                }

                return Ok(addedProfile);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Authorize]
        [HttpGet("{teamid}")]
        public async Task<ActionResult<OutgoingConversationDTO>> GetConversationInTeam(
            string teamId
        )
        {
            try
            {
                var loggedInUser = await GetLoggedInUserAsync();

                var teamConversation =
                    await _conversationService.GetTeamConversationWithAllMessages(
                        teamId,
                        loggedInUser
                    );
                var outgoingConversationDTO = new OutgoingConversationDTO(
                    teamConversation.Id,
                    teamConversation.DateCreated,
                    teamConversation.CreatorId,
                    teamConversation.TeamId
                );

                return Ok(outgoingConversationDTO);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Authorize]
        [HttpGet("teammessages/{teamid}")]
        public async Task<ActionResult<List<OutgoingMessageDTO>>> GetMessagesInTeamConversation(
            string teamId
        )
        {
            try
            {
               var loggedInUser = await GetLoggedInUserAsync();

                var teamConversation =
                    await _conversationService.GetTeamConversationWithAllMessages(
                        teamId,
                        loggedInUser
                    );
                var messages = teamConversation.Messages;
                var outgoingMessagesDTO = new List<OutgoingMessageDTO>();
                outgoingMessagesDTO = messages
                    .Select(
                        m =>
                            new OutgoingMessageDTO(
                                m.Id,
                                m.Content,
                                m.DateCreated,
                                m.ConversationParticipantId,
                                m.ConversationId,
                            m.ConversationParticipant != null ? m.ConversationParticipant.FullName : "Okänd",
                m.ConversationParticipant != null ? m.ConversationParticipant.ProfileId : null
                            )
                    )
                    .ToList();

                return Ok(outgoingMessagesDTO);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Authorize]
        [HttpPost("conversationparticipant")]
        public async Task<ActionResult<ConversationParticipantDTO>> GetConversationParticipant(
            [FromBody] GetParticipantDTO getParticipantDTO
        )
        {
            try
            {
                 var loggedInUser = await GetLoggedInUserAsync();

                var participant = await _conversationService.GetConversationParticipant(
                    getParticipantDTO.ConversationId,
                    getParticipantDTO.ProfileId,
                    loggedInUser
                );
                var participantDTO = new ConversationParticipantDTO()
                {
                    Id = participant.Id,
                    ProfileId = participant.ProfileId,
                    ConversationId = participant.ConversationId,
                    LastActive = participant.LastActive
                };

                return Ok(participantDTO);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
