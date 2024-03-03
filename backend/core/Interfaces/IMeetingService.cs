namespace core;

public interface IMeetingService
{
    Task<Meeting> CreateTeamMeetingAsync(CreateMeetingDTO incomingMeetingDTO);

    Task<Meeting> CreateAsync(CreateMeetingDTO incomingMeetingDTO);

    Task<Meeting> UpdateMeeting(IncomingMeetingDTO meeting);

    Task<Meeting> GetMeetingByTeamId(string teamId);
    Task<List<Meeting>> GetMeetingsByProfile(string profileId, User loggedInUser);
    Task DeleteMeetingAndOccasions(string meetingId, string loggedInUserId);

    Task<Meeting> GetById(string meetingId, string userId);
}
