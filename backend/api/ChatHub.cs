using core;
using Interfaces;
using Microsoft.AspNetCore.SignalR;

public class ChatHub : Hub
{
    private readonly IHubContext<ChatHub> _hubContext;

    public ChatHub(IHubContext<ChatHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task MessageSent(OutgoingMessageDTO message)
    {
        Console.WriteLine("------MESSAGE SENT-----------");

        await _hubContext.Clients.All.SendAsync("messageSent", message);
    }
}
