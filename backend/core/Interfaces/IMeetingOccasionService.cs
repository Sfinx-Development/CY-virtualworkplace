namespace core;

public interface IMeetingOccasionService
{
    Task<List<MeetingOccasion>> GetOccasionsByProfileId(string profileId);
}
