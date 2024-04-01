namespace core;

public interface IMeetingService
{
    Task<OutgoingMeetingDTO> CreateTeamMeetingAsync(CreateMeetingDTO incomingMeetingDTO);

    Task<OutgoingMeetingDTO> CreateAsync(CreateMeetingDTO incomingMeetingDTO);

    Task<OutgoingMeetingDTO> UpdateMeeting(IncomingMeetingDTO meeting);

    Task<OutgoingMeetingDTO> GetMeetingByTeamId(string teamId);
    Task<List<OutgoingMeetingDTO>> GetMeetingsByProfile(string profileId, User loggedInUser);
    Task DeleteMeetingAndOccasions(string meetingId, string loggedInUserId);

    //    bool MeetingTimeOverlaps(Meeting meeting1, Meeting meeting2);

    Task<OutgoingMeetingDTO> GetById(string meetingId, string userId);
    Task<List<OutgoingMeetingDTO>> GetTeamMeetingsInPeriodAsync(
        string teamId,
        DateTime startDateTime,
        DateTime? endDateTime
    );
}
