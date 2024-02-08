// profileId: Unik identifierare för profilen.
// teamId: Identifierare för det team som profilen tillhör.
// username: Användarnamn för profilen.
// isOnline: En indikator på om profilen för närvarande är online eller offline.
// lastOnline: Datum och tid för när profilen senast var online.
// lastActive
namespace core;

public class ProfileHboDTO
{
    public string ProfileId { get; set; }
    public string FullName { get; set; }
    public string TeamId { get; set; }
    public bool? IsOnline { get; set; }
    public DateTime? LastOnline { get; set; }
    public DateTime? LastActive { get; set; }

    //i frontend: filtrera de som tillhör mitt active team id OCH is online är true
    public ProfileHboDTO(
        string profileId,
        string fullName,
        string teamId,
        bool? isOnline,
        DateTime? lastOnline,
        DateTime? lastActive
    )
    {
        ProfileId = profileId;
        FullName = fullName;
        TeamId = teamId;
        IsOnline = isOnline;
        LastOnline = lastOnline;
        LastActive = lastActive;
    }
}
