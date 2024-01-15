namespace core;

public interface IMeetingRoomRepository
{
    Task<MeetingRoom> GetById(string id);
    Task<MeetingRoom> GetByTeamIdAsync(string teamId);
    Task<MeetingRoom> CreateAsync(MeetingRoom room);
    Task<MeetingRoom> UpdateAsync(MeetingRoom room);
    Task DeleteByIdAsync(string id);
}
