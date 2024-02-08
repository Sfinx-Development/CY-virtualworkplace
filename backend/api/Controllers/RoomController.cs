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
using Microsoft.AspNetCore.SignalR;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RoomController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly IHubContext<MeetingRoomHub> _hubContext;

        public RoomController(JwtService jwtService, IHubContext<MeetingRoomHub> hubContext)
        {
            _jwtService = jwtService;
            _hubContext = hubContext;
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Profile>> ProfileEnterMeetingRoom(
            [FromBody] string profileId
        )
        {
            await _hubContext.Clients.All.SendAsync("profileOffline", profileId);
            return Ok();
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Profile>> ProfileLeavingMeetingRoom(
            [FromBody] string profileId
        )
        {
            await _hubContext.Clients.All.SendAsync("profileOffline", profileId);
            return Ok();
        }
    }
}
