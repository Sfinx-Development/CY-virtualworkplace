namespace core;

public class MeetingOccasionService : IMeetingOccasionService
{
    private readonly IMeetingOccasionRepository _meetingOccasionRepository;

    public MeetingOccasionService(IMeetingOccasionRepository meetingOccasionRepository)
    {
        _meetingOccasionRepository = meetingOccasionRepository;
    }

    public async Task<List<MeetingOccasion>> GetOccasionsByProfileId(string profileId)
    {
        try
        {
            var occasions = await _meetingOccasionRepository.GetAllOccasionsByProfileId(profileId);
            return occasions;
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }
}
