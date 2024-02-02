using Interfaces;
using Microsoft.EntityFrameworkCore;

namespace core;

public class TeamRepository : ITeamRepository
{
    private readonly CyDbContext _cyDbContext;

    public TeamRepository(CyDbContext cyDbContext)
    {
        _cyDbContext = cyDbContext;
    }

    public async Task<Team> CreateAsync(Team team)
    {
        try
        {
            await _cyDbContext.Teams.AddAsync(team);
            await _cyDbContext.SaveChangesAsync();

            return team;
        }
        catch (Exception e)
        {
            throw new Exception();
        }
    }

    public async Task<Team> GetByCodeAsync(string code)
    {
        try
        {
            Team team = await _cyDbContext.Teams.FirstAsync(t => t.Code == code);
            if (team != null)
            {
                return team;
            }
            else
            {
                throw new Exception();
            }
        }
        catch (Exception e)
        {
            return null;
        }
    }

    public async Task<List<Team>> GetByUserIdAsync(string userId)
    {
        try
        {
            var teams = await _cyDbContext.Teams.Where(t => t.Profiles.Any(p => p.UserId == userId)).ToListAsync();
            return teams;
        }
        catch (Exception e)
        {
            throw new Exception();
        }
    }

    public async Task<Team> GetByIdAsync(string teamId)
    {
        try
        {
            Team team = await _cyDbContext.Teams.FirstAsync(t => t.Id == teamId);
            if (team != null)
            {
                return team;
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

    public async Task<Team> UpdateAsync(Team team)
    {
        try
        {
            var teamToUpdate = await _cyDbContext.Teams.FirstAsync(t => t.Id == team.Id);

            if (teamToUpdate == null)
            {
                throw new Exception();
            }

            teamToUpdate.Name = team.Name ?? teamToUpdate.Name;
            teamToUpdate.Code = team.Code ?? teamToUpdate.Code;
            teamToUpdate.TeamRole = team.TeamRole ?? teamToUpdate.TeamRole;

            _cyDbContext.Teams.Update(teamToUpdate);

            await _cyDbContext.SaveChangesAsync();
            return teamToUpdate;
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
            //OBS!!!!!!!!!!
            //sen behöver vi ta bort alla profiler som hör till teamet
            //endast ägaren kan ta bort teamet - fixas i service klaasssen
            var teamToDelete = await _cyDbContext.Teams.FindAsync(id);
            var deletedTeam = teamToDelete;
            if (teamToDelete != null)
            {
                _cyDbContext.Teams.Remove(teamToDelete);
                await _cyDbContext.SaveChangesAsync();
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}
