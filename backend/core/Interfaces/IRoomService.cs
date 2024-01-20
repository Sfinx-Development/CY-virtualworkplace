namespace core;

public interface IRoomService
{
    Task<Room> GetRoomById(string id);
}
