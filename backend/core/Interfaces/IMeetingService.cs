namespace core;

public interface IMeetingService
{
    Task<Meeting> CreateTeamMeetingAsync(IncomingMeetingDTO incomingMeetingDTO);

    Task<Meeting> CreateAsync(IncomingMeetingDTO incomingMeetingDTO);

    Task<Meeting> UpdateMeeting(Meeting meeting);

    Task<Meeting> GetMeetingByTeamId(string teamId);
    Task DeleteMeetingAndOccasions(string meetingId, string loggedInUserId);

    Task<Meeting> GetById(string meetingId, string userId);
}
