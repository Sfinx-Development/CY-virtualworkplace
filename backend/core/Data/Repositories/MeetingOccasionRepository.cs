using System.Security;
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

    public async Task<MeetingOccasion> GetOccasionById(string id)
    {
        try
        {
            MeetingOccasion occasion = await _cyDbContext
                .MeetingOccasions.Include(o => o.Profile)
                .Include(o => o.Meeting)
                .Where(o => o.Id == id)
                .FirstAsync();
            return occasion;
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task<List<MeetingOccasion>> GetAllOccasionsByProfileId(string profileId)
    {
        try
        {
            List<MeetingOccasion> occasions =
                await _cyDbContext
                    .MeetingOccasions.Where(m => m.Profile.Id == profileId)
                    .Include(m => m.Meeting)
                    .ToListAsync() ?? new List<MeetingOccasion>();
            return occasions;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<List<Meeting>> GetMeetingsByTeamId(string teamId)
    {
        try
        {
            var meetings = await _cyDbContext.Meetings.Where(m => m.TeamId == teamId).ToListAsync();

            return meetings;
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
