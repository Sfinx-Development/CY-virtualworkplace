using Interfaces;
using Microsoft.EntityFrameworkCore;

namespace core;

public class OfficeRepository
{
    private readonly CyDbContext _cyDbContext;

    public OfficeRepository(CyDbContext cyDbContext)
    {
        _cyDbContext = cyDbContext;
    }

    public async Task<Office> GetById(string id)
    {
        try
        {
            Office office = await _cyDbContext.Offices.Where(o => o.Id == id).FirstAsync();

            if (office == null)
            {
                throw new Exception();
            }
            else
            {
                return office;
            }
        }
        catch (Exception e)
        {
            throw new Exception();
        }
    }

    public async Task<Office> GetByProfile(string profileId)
    {
        try
        {
            Office office = await _cyDbContext
                .Offices.Where(o => o.Profile.Id == profileId)
                .FirstAsync();

            if (office == null)
            {
                throw new Exception();
            }
            else
            {
                return office;
            }
        }
        catch (Exception e)
        {
            throw new Exception();
        }
    }

    public async Task<Office> CreateAsync(Office office)
    {
        try
        {
            await _cyDbContext.Offices.AddAsync(office);
            await _cyDbContext.SaveChangesAsync();

            return office;
        }
        catch (Exception e)
        {
            throw new Exception();
        }
    }

    public async Task<Office> UpdateAsync(Office office)
    {
        try
        {
            var officeToUpdate = await _cyDbContext.Offices.FirstAsync(o => o.Id == office.Id);

            if (officeToUpdate == null)
            {
                throw new Exception();
            }

            officeToUpdate.RoomLayout = office.RoomLayout ?? officeToUpdate.RoomLayout;

            _cyDbContext.Offices.Update(officeToUpdate);

            await _cyDbContext.SaveChangesAsync();
            return officeToUpdate;
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
            var officeToDelete = await _cyDbContext.Offices.FindAsync(id);
            var deletedRoom = officeToDelete;
            if (officeToDelete != null)
            {
                _cyDbContext.Offices.Remove(officeToDelete);
                await _cyDbContext.SaveChangesAsync();
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}
