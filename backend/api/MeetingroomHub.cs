using core;
using Interfaces;
using Microsoft.AspNetCore.SignalR;

public class MeetingRoomHub : Hub
{
    IProfileRepository _profileRepository;

    public MeetingRoomHub(IProfileRepository profileRepository)
    {
        _profileRepository = profileRepository;
    }

    public async Task ProfileEnterMeetingRoom(string profileId)
    {
        Console.WriteLine("----------------ENTERING ");
        Console.WriteLine("PROFILEID:  " + profileId ?? "ej tillgängligt");
        //spara en ProfileHubDTO och sätt isonline true och skicka iväg den hela istället?
        //sen i frontenden filtrera ut dom som bara tillhör mitt active team id
        var profileToUpdate = await _profileRepository.GetByIdAsync(profileId);
        if (profileToUpdate != null)
        {
            var profileToUpdateDTO = new ProfileUpdateDTO { Id = profileId, IsOnline = true };
            var onlineProfile = await _profileRepository.UpdateOnlineAsync(profileToUpdateDTO);
            var profileHubDTO = new ProfileHboDTO(
                onlineProfile.Id,
                onlineProfile.FullName,
                onlineProfile.TeamId,
                onlineProfile.IsOnline,
                onlineProfile.LastOnline,
                onlineProfile.LastActive
            );
            await Clients.All.SendAsync("profileOnline", profileHubDTO);
        }
    }

    public async Task ProfileLeavingMeetingRoom(string profileId)
    {
        Console.WriteLine("-------------------LEAVING");
        //spara en ProfileHubDTO och sätt isonline false och skicka iväg den hela istället?
        var profileToUpdateDTO = new ProfileUpdateDTO { Id = profileId, IsOnline = false };
        var onlineProfile = await _profileRepository.UpdateOnlineAsync(profileToUpdateDTO);
        //behövs returnera den eller?
        await Clients.All.SendAsync("profileOffline", profileId);
    }

    //OJ HUB INTE HBO HEHE ändra sen ok angelina
    public async Task<List<ProfileHboDTO>> ProfileOnlineInTeams(string teamId)
    {
        // alla som är onliine i teamet redan
        var onlineProfilesInTeam = await _profileRepository.GetOnlineProfilesInTeamAsync(teamId);

        List<ProfileHboDTO> onlineHubProfiles = new();

        if (onlineProfilesInTeam != null && onlineProfilesInTeam.Count > 0)
        {
            Console.WriteLine("HÄR");
            onlineHubProfiles = onlineProfilesInTeam
                .Select(
                    p =>
                        new ProfileHboDTO(
                            p.Id,
                            p.FullName,
                            p.TeamId,
                            p.IsOnline,
                            p.LastOnline,
                            p.LastActive
                        )
                )
                .ToList();
        }
        onlineHubProfiles.ForEach(p => Console.WriteLine("ONLINE:   " + p.FullName));
        return onlineHubProfiles;
    }
}
