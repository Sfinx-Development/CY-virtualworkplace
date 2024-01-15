using Interfaces;
using Microsoft.EntityFrameworkCore;

namespace core;

public class MeetingRepository : IMeetingRepository
{
    private readonly CyDbContext _cyDbContext;

    public MeetingRepository(CyDbContext cyDbContext)
    {
        _cyDbContext = cyDbContext;
    }

    public async Task<Meeting> CreateAsync(Meeting meeting)
    {
        try
        {
            await _cyDbContext.Meetings.AddAsync(meeting);
            await _cyDbContext.SaveChangesAsync();

            return meeting;
        }
        catch (Exception e)
        {
            throw new Exception();
        }
    }

    public async Task<Meeting> GetByIdAsync(string id)
    {
        try
        {
            Meeting meeting = await _cyDbContext.Meetings.FirstAsync(m => m.Id == id);
            if (meeting != null)
            {
                return meeting;
            }
            else
            {
                throw new Exception();
            }
        }
        catch (Exception e)
        {
            throw new Exception();
        }
    }

    public async Task<Meeting> UpdateAsync(Meeting meeting)
    {
        try
        {
            var meetingToUpdate = await _cyDbContext.Meetings.FirstAsync(m => m.Id == meeting.Id);

            if (meetingToUpdate == null)
            {
                throw new Exception();
            }

            meetingToUpdate.Name = meeting.Name ?? meetingToUpdate.Name;
            meetingToUpdate.Description = meeting.Description ?? meetingToUpdate.Description;
            meetingToUpdate.Date = meetingToUpdate.Date;
            meetingToUpdate.Minutes = meetingToUpdate.Minutes;
            meetingToUpdate.IsRepeating = meetingToUpdate.IsRepeating;
            meetingToUpdate.Room = meeting.Room ?? meetingToUpdate.Room;

            _cyDbContext.Meetings.Update(meetingToUpdate);

            await _cyDbContext.SaveChangesAsync();
            return meetingToUpdate;
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
            var meetingToDelete = await _cyDbContext.Meetings.FindAsync(id);
            if (meetingToDelete != null)
            {
                _cyDbContext.Meetings.Remove(meetingToDelete);
                await _cyDbContext.SaveChangesAsync();
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}
