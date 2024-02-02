using core;

namespace Interfaces
{
    public interface ITeamRepository
    {
        Task<List<Team>> GetByUserIdAsync(string userId);
        Task<Team> GetByCodeAsync(string code);
        Task<Team> CreateAsync(Team team);
        Task<Team> UpdateAsync(Team team);
        Task DeleteByIdAsync(string id);
        Task<Team> GetByIdAsync(string teamId);
    }
}
