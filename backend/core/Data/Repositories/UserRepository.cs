using Microsoft.EntityFrameworkCore;

namespace core;

public class UserRepository
{
    private readonly CyDbContext _cyDbContext;

    public UserRepository(CyDbContext cyDbContext)
    {
        _cyDbContext = cyDbContext;
    }

    // public async Task<IEnumerable<Movie>> GetAsync()
    // {
    //     try
    //     {
    //         if (_trananDbContext.Movies.Count() < 1)
    //         {
    //             return new List<Movie>();
    //         }
    //         return await _trananDbContext.Movies
    //             .Include(m => m.Actors)
    //             .Include(m => m.Directors)
    //             .Include(m => m.Reviews)
    //             .ToListAsync();
    //     }
    //     catch (Exception e)
    //     {
    //        return null;
    //     }
    // }

    public async Task<User> GetByIdAsync(string id)
    {
        try
        {
            User user = await _cyDbContext.Users.FirstAsync(u => u.Id == id);
            if (user != null)
            {
                return user;
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

    public async Task<User> CreateAsync(User user)
    {
        try
        {
            await _cyDbContext.Users.AddAsync(user);
            await _cyDbContext.SaveChangesAsync();

            return user;
        }
        catch (Exception e)
        {
            throw new Exception();
        }
    }

    public async Task<User> UpdateAsync(User user)
    {
        try
        {
            var userToUpdate = await _cyDbContext.Users.FirstAsync(u => u.Id == u.Id);

            if (userToUpdate == null)
            {
                return null;
            }

            userToUpdate.FirstName = user.FirstName ?? userToUpdate.FirstName;
            userToUpdate.LastName = user.LastName ?? userToUpdate.LastName;
            userToUpdate.Gender = user.Gender ?? userToUpdate.Gender;
            userToUpdate.Email = user.Email ?? userToUpdate.Email;
            userToUpdate.Age = user.Age > 0 ? user.Age : userToUpdate.Age;
            userToUpdate.PhoneNumber = user.PhoneNumber ?? userToUpdate.PhoneNumber;
            userToUpdate.Password = user.Password ?? userToUpdate.Password;

            _cyDbContext.Users.Update(userToUpdate);

            await _cyDbContext.SaveChangesAsync();
            return userToUpdate;
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
            //sen behöver vi ta bort allt som har med usern att göra när vi har allt kodat o klart
            var userToDelete = await _cyDbContext.Users.FindAsync(id);
            var deletedUser = userToDelete;
            if (userToDelete != null)
            {
                _cyDbContext.Users.Remove(userToDelete);
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
