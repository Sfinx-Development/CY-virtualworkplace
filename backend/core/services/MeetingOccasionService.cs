using Interfaces;

namespace core;

public class MeetingOccasionService : IMeetingOccasionService
{
    private readonly IMeetingOccasionRepository _meetingOccasionRepository;
    private readonly IMeetingRepository _meetingRepository;
    private readonly IProfileRepository _profileRepository;

    public MeetingOccasionService(
        IMeetingOccasionRepository meetingOccasionRepository,
        IProfileRepository profileRepository,
        IMeetingRepository meetingRepository
    )
    {
        _meetingOccasionRepository = meetingOccasionRepository;
        _profileRepository = profileRepository;
        _meetingRepository = meetingRepository;
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

    public async Task DeleteOccasion(string id, string userId)
    {
        try
        {
            var profiles = await _profileRepository.GetByUserIdAsync(userId);
            var profileIds = profiles.Select(p => p.Id);
            var occasion = await _meetingOccasionRepository.GetOccasionById(id);
            if (profileIds.Contains(occasion.Meeting.OwnerId))
            {
                throw new Exception("Owner can't delete an occasion. Owner must delete meeting.");
            }
            else
            {
                if (profileIds.Contains(occasion.Profile.Id))
                {
                    await _meetingOccasionRepository.DeleteByIdAsync(occasion.Id);
                }
                else
                {
                    throw new Exception(
                        "Profiles can only delete their own occasions if not owner of meeting."
                    );
                }
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<MeetingOccasion> AddOccasion(AddToMeetingDTO addToMeetingDTO, string userId)
    {
        try
        {
            //min kollega osm ska bjudas in:
            var profileToBeAdded = await _profileRepository.GetByIdAsync(addToMeetingDTO.ProfileId);
            //jag som lägger till henne i mötet:
            var profile = await _profileRepository.GetByIdAsync(addToMeetingDTO.InviterId);
            //är det kakans userid som stämmer med invitern?
            if (profile.User.Id != userId)
            {
                throw new Exception("The inviter id does not seem to be the user.");
            }

            var meeting = await _meetingRepository.GetByIdAsync(addToMeetingDTO.MeetingId);

            //om jag är ägaren o om kolla om vi ingår i samma team
            if (meeting.OwnerId == profile.Id && profile.Team.Id == profileToBeAdded.Team.Id)
            {
                var occasion = new MeetingOccasion()
                {
                    Id = Utils.GenerateRandomId(),
                    Profile = profileToBeAdded,
                    Meeting = meeting
                };
                var occasionCreated = await _meetingOccasionRepository.CreateAsync(occasion);
                return occasionCreated;
            }
            else
            {
                throw new Exception("Only an owner can invite other profiles to meeting.");
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}
