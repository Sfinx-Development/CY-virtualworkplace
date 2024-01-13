using core;

namespace Interfaces;

public interface IOfficeService
{
    Task<Office> CreateOffice(Profile profile);
    Task<Office> GetOfficeByProfileId(string profileId);
    Task<Office> UpdateOffice(Office office);
    Task DeleteOffice(Office office);
}
