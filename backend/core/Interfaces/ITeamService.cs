using core;

namespace Interfaces;

public interface ITeamService
{
    Task<Team> CreateAsync(IncomingCreateTeamDTO incomingCreateTeamDTO);
    Task<Team> GetByCodeAsync(string code);
    Task<Team> UpdateTeam(Team team);
   
}