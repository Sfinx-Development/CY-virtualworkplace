namespace core;

public interface IMeetingOccasionService
{
    Task<List<OutgoingOcassionDTO>> GetOccasionsByProfileId(string profileId);

    Task<List<OutgoingOcassionDTO>> GetPastOccasionsByProfileId(string profileId);

    Task DeleteOccasion(string id, string userId);

    Task<OutgoingOcassionDTO> AddOccasion(AddToMeetingDTO addToMeetingDTO, string userId);

    Task AddOccasionsToNewProfiles(string profileId, string teamId);
}
