namespace core;

public class MeetingOccasion
{
    public string Id { get; set; }
    public Meeting Meeting { get; set; }
    public string MeetingId { get; set; }
    public Profile Profile { get; set; }
    public string ProfileId { get; set; }

    public MeetingOccasion() { }
    public MeetingOccasion(string id, string meetingId, string profileId) 
    {
        Id = id;
        MeetingId = meetingId;
        ProfileId = profileId;
     }
}
