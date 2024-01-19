namespace core;

public interface IMeetingOccasionService
{
    Task<List<MeetingOccasion>> GetOccasionsByProfileId(string profileId);

    Task DeleteOccasion(string id, string userId);

    Task<MeetingOccasion> AddOccasion(AddToMeetingDTO addToMeetingDTO, string userId);
}
