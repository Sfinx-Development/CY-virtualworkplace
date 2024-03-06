using Interfaces;

namespace core;

public class OfficeService : IOfficeService
{
    private readonly IOfficeRepository _officeRepository;

    public OfficeService(IOfficeRepository officeRepository)
    {
        _officeRepository = officeRepository;
    }

    public async Task<Office> CreateOffice(Profile profile)
    {
        // Cy cy = new() { Id = Utils.GenerateRandomId() };

        Office office =
            new()
            {
                Id = Utils.GenerateRandomId(),
                Profile = profile,
                RoomLayout = "default",
                ProfileId = profile.Id
            };

        Office createdOffice = await _officeRepository.CreateAsync(office);
        return createdOffice;
    }

    public async Task<Office> GetOfficeByProfileId(string profileId)
    {
        try
        {
            var office = await _officeRepository.GetByProfile(profileId);

            if (office == null)
            {
                throw new Exception("office can't be found");
            }
            else
            {
                return office;
            }
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task<Office> UpdateOffice(Office office)
    {
        try
        {
            var foundoffice = await _officeRepository.GetById(office.Id) ?? throw new Exception();
            foundoffice.RoomLayout = office.RoomLayout;
            var updatedRoom = await _officeRepository.UpdateAsync(foundoffice);
            return updatedRoom;
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task DeleteOffice(Office office)
    {
        try
        {
            if (office != null)
            {
                await _officeRepository.DeleteByIdAsync(office.Id);
            }
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }
}
