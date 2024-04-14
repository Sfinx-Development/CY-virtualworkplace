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
            Meeting meeting = await _cyDbContext.Meetings.Where(m => m.Id == id).FirstAsync();

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

    public async Task<List<Meeting>> GetAllByTeam(string teamId)
    {
        try
        {
            var meetings = await _cyDbContext.Meetings.Where(m => m.TeamId == teamId).ToListAsync();
            return meetings;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<bool> IsOverLappedMeetings(CreateMeetingDTO createMeetingDTO)
    {
        var overlappingMeetings = await _cyDbContext
            .Meetings.Where(
                m =>
                    createMeetingDTO.Date.AddMinutes(60) < m.Date.AddMinutes(m.Minutes)
                    && m.Date < createMeetingDTO.Date.AddMinutes(createMeetingDTO.Minutes + 60)
            )
            .ToListAsync();
        if (overlappingMeetings.Count > 0)
        {
            return true;
        }
        return false;
    }
}
