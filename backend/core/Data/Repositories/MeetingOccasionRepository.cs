using Interfaces;
using Microsoft.EntityFrameworkCore;

namespace core;

public class MeetingOccasionRepository : IMeetingOccasionRepository
{
    private readonly CyDbContext _cyDbContext;

    public MeetingOccasionRepository(CyDbContext cyDbContext)
    {
        _cyDbContext = cyDbContext;
    }

    public async Task<MeetingOccasion> CreateAsync(MeetingOccasion occasion)
    {
        try
        {
            await _cyDbContext.MeetingOccasions.AddAsync(occasion);
            await _cyDbContext.SaveChangesAsync();

            return occasion;
        }
        catch (Exception e)
        {
            throw new Exception();
        }
    }

    public async Task<List<MeetingOccasion>> GetAllOccasionsByProfileId(string profileId)
    {
        try
        {
            List<MeetingOccasion> occasions = await _cyDbContext
                .MeetingOccasions.Include(o => o.Meeting)
                .ThenInclude(m => m.Room)
                .Where(m => m.Profile.Id == profileId)
                .ToListAsync();
            if (occasions != null)
            {
                return occasions;
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

    // public async Task<Meeting> UpdateAsync(Meeting meeting)
    // {
    //     try
    //     {
    //         var meetingToUpdate = await _cyDbContext.Meetings.FirstAsync(m => m.Id == meeting.Id);

    //         if (meetingToUpdate == null)
    //         {
    //             throw new Exception();
    //         }

    //         meetingToUpdate.Name = meeting.Name ?? meetingToUpdate.Name;
    //         meetingToUpdate.Description = meeting.Description ?? meetingToUpdate.Description;
    //         meetingToUpdate.Date = meetingToUpdate.Date;
    //         meetingToUpdate.Minutes = meetingToUpdate.Minutes;
    //         meetingToUpdate.IsRepeating = meetingToUpdate.IsRepeating;
    //         meetingToUpdate.Room = meeting.Room ?? meetingToUpdate.Room;

    //         _cyDbContext.Meetings.Update(meetingToUpdate);

    //         await _cyDbContext.SaveChangesAsync();
    //         return meetingToUpdate;
    //     }
    //     catch (Exception e)
    //     {
    //         throw new Exception();
    //     }
    // }

    public async Task<List<MeetingOccasion>> GetAllOccasionsByMeetingId(string id)
    {
        try
        {
            List<MeetingOccasion> occasions = await _cyDbContext
                .MeetingOccasions.Include(m => m.Meeting)
                .ThenInclude(m => m.Room)
                .Where(mo => mo.Meeting.Id == id)
                .ToListAsync();
            return occasions;
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task DeleteByIdAsync(string id)
    {
        try
        {
            var meetingOccasionToDelete = await _cyDbContext.MeetingOccasions.FindAsync(id);
            if (meetingOccasionToDelete != null)
            {
                _cyDbContext.MeetingOccasions.Remove(meetingOccasionToDelete);
                await _cyDbContext.SaveChangesAsync();
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}
