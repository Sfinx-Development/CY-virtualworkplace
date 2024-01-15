namespace core;

public interface IMeetingOccasionRepository
{
    Task<List<MeetingOccasion>> GetAllOccasionsByMeetingId(string id);
    Task DeleteByIdAsync(string id);
    Task<MeetingOccasion> CreateAsync(MeetingOccasion occasion);
}
