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

    public async Task<List<OutgoingOcassionDTO>> GetOccasionsByProfileId(string profileId)
    {
        try
        {
            var occasions = await _meetingOccasionRepository.GetAllOccasionsByProfileId(profileId);
            var occasionsNotPast = new List<MeetingOccasion>();
            foreach (var occasion in occasions)
            {
                if (IsDatePast(occasion.Meeting))
                {
                    //HÄMTA RECURRENCEINFO MED MEETING O UPPDATERA DB
                    var newDateSet = await SetNewDateForMeeting(occasion.Meeting);
                    if (newDateSet)
                    {
                        occasionsNotPast.Add(occasion);
                    }
                }
                else
                {
                    occasionsNotPast.Add(occasion);
                }
            }

            var occasionsDTOs = new List<OutgoingOcassionDTO>();
            occasionsDTOs =
                occasionsNotPast
                    .Select(
                        p =>
                            new OutgoingOcassionDTO(
                                p.Id,
                                p.MeetingId,
                                p.ProfileId,
                                p.Meeting.Name,
                                p.Meeting.Description,
                                p.Meeting.Date,
                                p.Meeting.Minutes
                            )
                    )
                    .ToList() ?? new List<OutgoingOcassionDTO>();
            return occasionsDTOs;
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task<List<OutgoingOcassionDTO>> GetPastOccasionsByProfileId(string profileId)
    {
        try
        {
            var occasions = await _meetingOccasionRepository.GetAllOccasionsByProfileId(profileId);
            var pastOccasions = occasions.Where(occasion => IsDatePast(occasion.Meeting)).ToList();
            var pastDTOs = new List<OutgoingOcassionDTO>();
            pastDTOs = pastOccasions
                .Select(
                    p =>
                        new OutgoingOcassionDTO(
                            p.Id,
                            p.MeetingId,
                            p.ProfileId,
                            p.Meeting.Name,
                            p.Meeting.Description,
                            p.Meeting.Date,
                            p.Meeting.Minutes
                        )
                )
                .ToList();
            return pastDTOs;
        }
        catch (Exception)
        {
            throw new Exception("An error occurred while fetching past occasions.");
        }
    }

    public static bool IsDatePast(Meeting meeting)
    {
        DateTime endDate = meeting.Date.AddMinutes(meeting.Minutes);
        return DateTime.Now >= endDate;
    }

    public async Task<bool> SetNewDateForMeeting(Meeting meeting)
    {
        //om det är återkommande möte och datumet har gått ut
        if (meeting.IsRepeating && IsDatePast(meeting) && DateTime.Now <= meeting.EndDate)
        {
            var nextDate = meeting.Date.AddDays(meeting.Interval);
            // var nextDate = meeting.Date.AddDays(meeting.Interval).ToUniversalTime();

            if (DateTime.Now <= nextDate)
            {
                meeting.Date = nextDate;
                var updatedMeeting = await _meetingRepository.UpdateAsync(meeting);
                if (updatedMeeting != null)
                {
                    return true;
                }
            }
        }
        return false;
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

    public async Task<OutgoingOcassionDTO> AddOccasion(
        AddToMeetingDTO addToMeetingDTO,
        string userId
    )
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
                var occasionDTO = new OutgoingOcassionDTO(
                    occasionCreated.Id,
                    occasionCreated.MeetingId,
                    occasionCreated.ProfileId,
                    meeting.Name,
                    meeting.Description,
                    meeting.Date,
                    meeting.Minutes
                );
                return occasionDTO;
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

    public async Task AddOccasionsToNewProfiles(string profileId, string teamId)
    {
        try
        {
            var profile = await _profileRepository.GetByIdAsync(profileId);

            var meetings = await _meetingOccasionRepository.GetMeetingsByTeamId(teamId);

            foreach (var meeting in meetings)
            {
                MeetingOccasion ownersOccasion =
                    new()
                    {
                        Id = Utils.GenerateRandomId(),
                        Profile = profile,
                        Meeting = meeting
                    };
                await _meetingOccasionRepository.CreateAsync(ownersOccasion);
            }
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}
