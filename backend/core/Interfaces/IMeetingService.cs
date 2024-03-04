namespace core;

public interface IMeetingService
{
    Task<Meeting> CreateTeamMeetingAsync(CreateMeetingDTO incomingMeetingDTO);

    Task<Meeting> CreateAsync(CreateMeetingDTO incomingMeetingDTO);

    Task<Meeting> UpdateMeeting(IncomingMeetingDTO meeting);

    Task<Meeting> GetMeetingByTeamId(string teamId);
    Task<List<Meeting>> GetMeetingsByProfile(string profileId, User loggedInUser);
    Task DeleteMeetingAndOccasions(string meetingId, string loggedInUserId);
//    bool MeetingTimeOverlaps(Meeting meeting1, Meeting meeting2);

    Task<Meeting> GetById(string meetingId, string userId);
Task<List<Meeting>> GetTeamMeetingsInPeriodAsync(string teamId, DateTime startDateTime, DateTime? endDateTime);


}
