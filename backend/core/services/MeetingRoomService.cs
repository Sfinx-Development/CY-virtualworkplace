using Interfaces;

namespace core;

public class MeetingRoomServie : IMeetingRoomService
{
    private readonly IMeetingRoomRepository _meetingRoomRepository;

    public MeetingRoomServie(IMeetingRoomRepository meetingRoomRepository)
    {
        _meetingRoomRepository = meetingRoomRepository;
    }

    public async Task<MeetingRoom> CreateMeetingRoom(Team team)
    {
        Cy cy = new() { Id = Utils.GenerateRandomId() };

        MeetingRoom meetingRoom =
            new()
            {
                Id = Utils.GenerateRandomId(),
                Team = team,
                TeamId = team.Id,
                RoomLayout = "default",
                Cy = cy
            };

        MeetingRoom createdRoom = await _meetingRoomRepository.CreateAsync(meetingRoom);
        return createdRoom;
    }

    public async Task<MeetingRoom> GetMeetingRoomByTeamId(string teamId)
    {
        try
        {
            var meetingRoom = await _meetingRoomRepository.GetByTeamIdAsync(teamId);

            if (meetingRoom == null)
            {
                throw new Exception("meetingroom can't be found");
            }
            else
            {
                return meetingRoom;
            }
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task<MeetingRoom> UpdateMeetingRoom(MeetingRoom meetingRoom)
    {
        try
        {
            var foundRoom =
                await _meetingRoomRepository.GetByTeamIdAsync(meetingRoom.Id)
                ?? throw new Exception();
            foundRoom.RoomLayout = meetingRoom.RoomLayout;
            var updatedRoom = await _meetingRoomRepository.UpdateAsync(foundRoom);
            return updatedRoom;
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task DeleteMeetingRoom(MeetingRoom meetingRoom)
    {
        try
        {
            if (meetingRoom != null)
            {
                await _meetingRoomRepository.DeleteByIdAsync(meetingRoom.Id);
            }
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }
}
