using Interfaces;
using Microsoft.EntityFrameworkCore;

namespace core;

public class MeetingRoomRepository
{
    private readonly CyDbContext _cyDbContext;

    public MeetingRoomRepository(CyDbContext cyDbContext)
    {
        _cyDbContext = cyDbContext;
    }

     public async Task<MeetingRoom> GetById(string id)
    {
        try
        {
            MeetingRoom room = await _cyDbContext
                .MeetingRooms.Where(m => m.Id == id)
                .FirstAsync();

            if (room == null)
            {
                throw new Exception();
            }
            else
            {
                return room;
            }
        }
        catch (Exception e)
        {
            throw new Exception();
        }
    }

    public async Task<MeetingRoom> GetByTeamIdAsync(string teamId)
    {
        try
        {
            MeetingRoom room = await _cyDbContext
                .MeetingRooms.Where(m => m.Team.Id == teamId)
                .FirstAsync();

            if (room == null)
            {
                throw new Exception();
            }
            else
            {
                return room;
            }
        }
        catch (Exception e)
        {
            throw new Exception();
        }
    }

    public async Task<MeetingRoom> CreateAsync(MeetingRoom room)
    {
        try
        {
            await _cyDbContext.MeetingRooms.AddAsync(room);
            await _cyDbContext.SaveChangesAsync();

            return room;
        }
        catch (Exception e)
        {
            throw new Exception();
        }
    }

    public async Task<MeetingRoom> UpdateAsync(MeetingRoom room)
    {
        try
        {
            var roomToUpdate = await _cyDbContext.MeetingRooms.FirstAsync(m => m.Id == room.Id);

            if (roomToUpdate == null)
            {
                throw new Exception();
            }

            roomToUpdate.RoomLayout = room.RoomLayout ?? roomToUpdate.RoomLayout;

            _cyDbContext.MeetingRooms.Update(roomToUpdate);

            await _cyDbContext.SaveChangesAsync();
            return roomToUpdate;
        }
        catch (Exception e)
        {
            throw new Exception();
        }
    }

    public async Task DeleteByIdAsync(string id)
    {
        try
        {
            var roomToDelete = await _cyDbContext.MeetingRooms.FindAsync(id);
            var deletedRoom = roomToDelete;
            if (roomToDelete != null)
            {
                _cyDbContext.MeetingRooms.Remove(roomToDelete);
                await _cyDbContext.SaveChangesAsync();
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}
