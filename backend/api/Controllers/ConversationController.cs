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

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Conversation>> CreateConversation([FromBody] string teamId)
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
                                m.ConversationParticipant.FullName,
                                m.ConversationParticipant.ProfileId
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
