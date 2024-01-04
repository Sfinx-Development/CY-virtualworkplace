using core;

namespace Interfaces
{
    public interface ITeamRepository
    {
        Task<Team> GetByCodeAsync(string code);
        Task<Team> CreateAsync(Team team);
        Task<Team> UpdateAsync(Team team);
        Task DeleteByIdAsync(string id);
    }
}
