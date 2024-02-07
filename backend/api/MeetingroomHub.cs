using Microsoft.AspNetCore.SignalR;

public class MeetingRoomHub : Hub
{
    public async Task ProfileEnterMeetingRoom(string profileId)
    {
        Console.WriteLine("----------------ENTERING ");
        Console.WriteLine("PROFILEID:  " + profileId ?? "ej tillgängligt");
        // Console.ReadLine();
        await Clients.All.SendAsync("profileOnline", profileId);
    }

    public async Task ProfileLeavingMeetingRoom(string profileId)
    {
        Console.WriteLine("-------------------LEAVING");
        await Clients.All.SendAsync("profileOffline", profileId);
    }
}
