using Interfaces;

namespace core;

public class RoomService : IRoomService
{
    private readonly IMeetingRoomRepository _meetingRoomRepository;
    private readonly IOfficeRepository _officeRepository;

    public RoomService(
        IMeetingRoomRepository meetingRoomRepository,
        IOfficeRepository officeRepository
    )
    {
        _meetingRoomRepository = meetingRoomRepository;
        _officeRepository = officeRepository;
    }

    public async Task<Room> GetRoomById(string id)
    {
        Room room = new();
        try
        {
            room = await _meetingRoomRepository.GetById(id);
            if (room == null)
            {
                room = await _officeRepository.GetById(id);
                if (room == null)
                {
                    throw new Exception();
                }
            }
            return room;
        }
        catch (Exception)
        {
            throw new Exception("Room id does not exist.");
        }
    }
}
