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

    public async Task<List<Profile>> GetProfilesInTeamAsync(string teamId)
    {
        try
        {
            //hämtar alla profiler och dess team som har det useridt
            List<Profile> profiles = await _cyDbContext
                .Profiles.Include(p => p.Team)
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
            throw new Exception();
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
