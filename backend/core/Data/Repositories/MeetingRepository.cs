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
            Console.WriteLine("MÖTET HAR SPARATS TILL DATANASEN : ", meeting);

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
            Meeting meeting = await _cyDbContext
                .Meetings.Include(m => m.Room)
                .ThenInclude(r => r.Cy)
                .Where(m => m.Id == id)
                .FirstAsync();

            if (meeting != null)
            {
                return meeting;
            }
            else
            {
                throw new Exception("Meeting not found.");
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
            _cyDbContext.Meetings.Update(meeting);

            await _cyDbContext.SaveChangesAsync();
            return meeting;
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
