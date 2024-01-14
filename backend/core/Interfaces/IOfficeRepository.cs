using core;

namespace Interfaces;

public interface IOfficeRepository
{
    Task<Office> GetById(string id);

    Task<Office> GetByProfile(string profileId);

    Task<Office> CreateAsync(Office office);

    Task<Office> UpdateAsync(Office office);

    Task DeleteByIdAsync(string id);
}
