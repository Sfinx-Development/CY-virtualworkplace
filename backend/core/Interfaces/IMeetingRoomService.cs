using core;

namespace Interfaces;

public interface IMeetingRoomService
{
    Task<MeetingRoom> CreateMeetingRoom(Team team, Cy cy);
    Task<MeetingRoom> GetMeetingRoomByTeamId(string teamId);
    Task<MeetingRoom> UpdateMeetingRoom(MeetingRoom meetingRoom);
    Task DeleteMeetingRoom(MeetingRoom meetingRoom);
}
