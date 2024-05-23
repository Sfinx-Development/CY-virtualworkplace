using Interfaces;
using Microsoft.EntityFrameworkCore;

namespace core;

public class ProfileRepository : IProfileRepository
{
    private readonly CyDbContext _cyDbContext;

    public ProfileRepository(CyDbContext cyDbContext)
    {
        _cyDbContext = cyDbContext;
    }

    public async Task<List<Profile>> GetByUserIdAsync(string userId)
    {
        try
        {
            //hämtar alla profiler och dess team som har det useridt
            List<Profile> profiles = await _cyDbContext
                .Profiles.Include(p => p.Team)
                .Where(p => p.User.Id == userId)
                .ToListAsync();

            if (profiles == null)
            {
                throw new Exception();
            }
            else
            {
                return profiles;
            }
        }
        catch (Exception e)
        {
            return null;
        }
    }

    public async Task<Profile> GetByUserAndTeamIdAsync(string userId, string teamId)
    {
        try
        {
            //hämtar alla profiler och dess team som har det useridt
            var profile = await _cyDbContext
                .Profiles.Include(p => p.Team)
                .Where(p => p.User.Id == userId && p.TeamId == teamId)
                .FirstAsync();

            if (profile == null)
            {
                throw new Exception();
            }
            else
            {
                return profile;
            }
        }
        catch (Exception e)
        {
            return null;
        }
    }

    public async Task<List<Profile>> GetProfilesInTeamAsync(string teamId)
    {
        try
        {
            //hämtar alla profiler och dess team som har det useridt
            List<Profile> profiles = await _cyDbContext
                .Profiles.Include(p => p.Team)
                .Include(p => p.User)
                .Where(p => p.Team.Id == teamId)
                .ToListAsync();

            if (profiles == null)
            {
                throw new Exception();
            }
            else
            {
                return profiles;
            }
        }
        catch (Exception e)
        {
            return null;
        }
    }

    public async Task<List<Profile>> GetOnlineProfilesInTeamAsync(string teamId)
    {
        try
        {
            List<Profile> profiles = await _cyDbContext
                .Profiles.Include(p => p.Team)
                .Where(p => p.Team.Id == teamId && p.IsOnline == true)
                .ToListAsync();

            if (profiles == null)
            {
                throw new Exception();
            }
            else
            {
                return profiles;
            }
        }
        catch (Exception e)
        {
            return null;
        }
    }

    public async Task<Profile> GetByIdAsync(string profileId)
    {
        try
        {
            //hämtar alla profiler och dess team som har det useridt

            Profile profile = await _cyDbContext
                .Profiles.Include(p => p.User)
                .Include(p => p.Team)
                .Where(p => p.Id == profileId)
                .FirstAsync();

            if (profile == null)
            {
                throw new Exception();
            }
            else
            {
                return profile;
            }
        }
        catch (Exception e)
        {
            throw new Exception();
        }
    }

    public async Task<Profile> CreateAsync(Profile profile)
    {
        try
        {
            await _cyDbContext.Profiles.AddAsync(profile);
            await _cyDbContext.SaveChangesAsync();

            return profile;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<Profile> UpdateAsync(ProfileUpdateDTO profile)
    {
        try
        {
            var profileToUpdate = await _cyDbContext.Profiles.FirstAsync(p => p.Id == profile.Id);

            if (profileToUpdate == null)
            {
                throw new Exception();
            }

            profileToUpdate.FullName = profile.FullName ?? profileToUpdate.FullName;
            profileToUpdate.Role = profile.Role ?? profileToUpdate.Role;
            profileToUpdate.IsOwner = profile.IsOwner;
            profileToUpdate.IsOnline = profile.IsOnline;

            _cyDbContext.Profiles.Update(profileToUpdate);

            await _cyDbContext.SaveChangesAsync();
            return profileToUpdate;
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
            // DENNA NÄSTA
            var meetingOccasions = await _cyDbContext.MeetingOccasions.Where(m => m.ProfileId == id).ToListAsync();
            _cyDbContext.MeetingOccasions.RemoveRange(meetingOccasions);

            var conversationstopartisipants = await _cyDbContext.ConversationParticipants.Where(c => c.ProfileId == id).ToListAsync();

            var messages = new List<Message>();

            foreach (var cp in conversationstopartisipants)
            {
                messages = await _cyDbContext.Messages.Where(m => m.ConversationParticipantId == cp.Id).ToListAsync();

                foreach (var m in messages)
                {
                    m.ConversationParticipant = null;
                    m.ConversationParticipantId = null;

                    _cyDbContext.Messages.Update(m);
                }

                _cyDbContext.ConversationParticipants.Remove(cp);
            }

            var profileToSurveys = await _cyDbContext.ProfileToSurveys.Where(ps => ps.ProfileId == id).ToListAsync();

            _cyDbContext.ProfileToSurveys.RemoveRange(profileToSurveys);

            var updateCommments = await _cyDbContext.UpdateComments.Where(u => u.ProfileId == id).ToListAsync();

            foreach (var u in updateCommments)
            {
                var projectFiles = await _cyDbContext.ProjectFiles.Where(pf => pf.UpdateCommentId == u.Id).ToListAsync();
                _cyDbContext.ProjectFiles.RemoveRange(projectFiles);
            }
            _cyDbContext.UpdateComments.RemoveRange(updateCommments);

            //kolla så den tas bort från teamet med då direkt
            // först hitta profilernas alla messeages, conversationtopartisipant, meetinoccasion
            //updatecomments, profilesurveys, radera alla dessa grejer
            //till sist orofilen,, hämta alla conversationstopartisipants, och använd removerange ist för foreach. 
            // alt i projectet som har ett profilid på sig ska försvinna
            //kolla så den tas bort från teamet med då direkt
            var profileToDelete = await _cyDbContext.Profiles.FindAsync(id);
            var deletedProfile = profileToDelete;
            if (profileToDelete != null)
            {
                _cyDbContext.Profiles.Remove(profileToDelete);
                await _cyDbContext.SaveChangesAsync();
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<Profile> UpdateOnlineAsync(ProfileUpdateDTO profile)
    {
        try
        {
            var profileToUpdate = await _cyDbContext.Profiles.FirstAsync(p => p.Id == profile.Id);

            if (profileToUpdate == null)
            {
                throw new Exception();
            }

            profileToUpdate.IsOnline = profile.IsOnline;

            _cyDbContext.Profiles.Update(profileToUpdate);

            await _cyDbContext.SaveChangesAsync();
            return profileToUpdate;
        }
        catch (Exception e)
        {
            throw new Exception();
        }
    }

    // public async Task DeleteAsync()
    // {
    //     try
    //     {
    //         _trananDbContext.Movies.ToList().ForEach(m => _trananDbContext.Movies.Remove(m));
    //         await _trananDbContext.SaveChangesAsync();
    //     }
    //     catch (Exception e)
    //     {
    //         throw new Exception(e.Message);
    //     }
    // }
}
