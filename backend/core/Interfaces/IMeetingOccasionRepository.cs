namespace core;

public interface IMeetingOccasionRepository
{
    Task<List<MeetingOccasion>> GetAllOccasionsByMeetingId(string id);
    Task<MeetingOccasion> GetOccasionById(string id);
    Task<List<MeetingOccasion>> GetAllOccasionsByProfileId(string profileId);
    Task DeleteByIdAsync(string id);
    Task<MeetingOccasion> CreateAsync(MeetingOccasion occasion);
    Task<List<Meeting>> GetMeetingsByTeamId(string teamId);
}
