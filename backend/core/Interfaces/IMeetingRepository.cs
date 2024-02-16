namespace core;

public interface IMeetingRepository
{
    Task<Meeting> CreateAsync(Meeting meeting);
    Task<Meeting> GetByIdAsync(string id);
    Task<Meeting> UpdateAsync(Meeting meeting);
    Task DeleteByIdAsync(string id);
     
}
