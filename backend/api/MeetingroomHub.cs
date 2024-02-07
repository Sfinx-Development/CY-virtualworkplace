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
            var profileToUpdateDTO = new ProfileUpdateDTO();
            profileToUpdateDTO.Id = profileId;
            profileToUpdateDTO.IsOnline = true;
            var onlineProfile = await _profileRepository.UpdateAsync(profileToUpdateDTO);
            var profileHubDTO = new ProfileHboDTO(
                onlineProfile.Id,
                onlineProfile.FullName,
                onlineProfile.TeamId,
                onlineProfile.IsOnline,
                onlineProfile.LastOnline,
                onlineProfile.LastActive
            );
        }
        await Clients.All.SendAsync("profileOnline", profileId);
    }

    public async Task ProfileLeavingMeetingRoom(string profileId)
    {
        Console.WriteLine("-------------------LEAVING");
        //spara en ProfileHubDTO och sätt isonline false och skicka iväg den hela istället?
        await Clients.All.SendAsync("profileOffline", profileId);
    }

    //OJ HUB INTE HBO HEHE ändra sen ok angelina
    public async Task<List<ProfileHboDTO>> GetOnlineProfilesInTeam(string teamId)
    {
        // alla som är onliine i teamet redan
        var profilesInTeam = await _profileRepository.GetProfilesInTeamAsync(teamId);
        List<Profile> onlineProfiles = new();
        List<ProfileHboDTO> onlineHubProfiles = new();
        if (profilesInTeam != null)
        {
            onlineProfiles = profilesInTeam.Where(p => p.IsOnline == true).ToList();
        }
        if (onlineProfiles != null && onlineProfiles.Count > 0)
        {
            onlineHubProfiles = onlineProfiles
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
        return onlineHubProfiles;
    }
}
