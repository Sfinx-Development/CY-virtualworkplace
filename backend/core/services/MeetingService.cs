namespace core;

using Interfaces;

public class MeetingService
{
    private readonly IMeetingRepository _meetingRepository;
    private readonly IProfileRepository _profileRepository;
    private readonly RoomService _roomService;
    private readonly IMeetingOccasionRepository _meetingOccasionRepository;

    public MeetingService(
        IMeetingRepository meetingRepository,
        IProfileRepository profileRepository,
        RoomService roomService,
        IMeetingOccasionRepository meetingOccasionRepository
    )
    {
        _meetingRepository = meetingRepository;
        _profileRepository = profileRepository;
        _roomService = roomService;
        _meetingOccasionRepository = meetingOccasionRepository;
    }

    public async Task<Meeting> CreateAsync(IncomingMeetingDTO incomingMeetingDTO)
    {
        try
        {
            Room room = await _roomService.GetRoomById(incomingMeetingDTO.RoomId);
            Profile profile = await _profileRepository.GetByIdAsync(incomingMeetingDTO.OwnerId);

            Meeting meeting =
                new()
                {
                    Id = Utils.GenerateRandomId(),
                    Name = incomingMeetingDTO.Name,
                    Description = incomingMeetingDTO.Description,
                    Date = incomingMeetingDTO.Date,
                    Minutes = incomingMeetingDTO.Minutes,
                    IsRepeating = incomingMeetingDTO.IsRepeating,
                    Room = room,
                    OwnerId = incomingMeetingDTO.OwnerId
                };

            Meeting createdMeeting = await _meetingRepository.CreateAsync(meeting);

            MeetingOccasion ownersOccasion =
                new()
                {
                    Id = Utils.GenerateRandomId(),
                    Profile = profile,
                    Meeting = meeting
                };
            await _meetingOccasionRepository.CreateAsync(ownersOccasion);

            return createdMeeting;
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task<Meeting> UpdateMeeting(Meeting meeting)
    {
        try
        {
            var foundMeeting =
                await _meetingRepository.GetByIdAsync(meeting.Id) ?? throw new Exception();

            foundMeeting.Name = meeting.Name ?? foundMeeting.Name;
            foundMeeting.Description = meeting.Description ?? foundMeeting.Description;
            foundMeeting.Date = meeting.Date;
            foundMeeting.Minutes = meeting.Minutes;
            foundMeeting.IsRepeating = meeting.IsRepeating;
            foundMeeting.Room = meeting.Room ?? foundMeeting.Room;

            var updatedMeeting = await _meetingRepository.UpdateAsync(foundMeeting);
            return updatedMeeting;
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task DeleteMeetingAndOccasions(DeleteMeetingDTO deleteMeetingDTO)
    {
        try
        {
            var profile = await _profileRepository.GetByIdAsync(deleteMeetingDTO.OwnerId);
            var meeting = await _meetingRepository.GetByIdAsync(deleteMeetingDTO.MeetingId);

            if (profile.Id == meeting.OwnerId)
            {
                //hämta alla meetingoccasions för mötet och radera dom sen mötet
                var meetingOccasions = await _meetingOccasionRepository.GetAllOccasionsByMeetingId(
                    meeting.Id
                );

                foreach (var mo in meetingOccasions)
                {
                    await _meetingOccasionRepository.DeleteByIdAsync(mo.Id);
                }

                await _meetingRepository.DeleteByIdAsync(meeting.Id);
            }
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task<Meeting> GetById(string meetingId, string userId)
    {
        //om man har ett mötestillfälle i mötet så får man tillgång att hämta mötet
        var profiles = await _profileRepository.GetByUserIdAsync(userId);
        var profileIds = profiles.Select(p => p.Id).ToList();

        try
        {
            var meeting = await _meetingRepository.GetByIdAsync(meetingId);
            var occasions = await _meetingOccasionRepository.GetAllOccasionsByMeetingId(meeting.Id);
            bool anyMatch = occasions.Any(occasion => profileIds.Contains(occasion.Profile.Id));

            if (anyMatch)
            {
                return meeting;
            }
            else
            {
                throw new Exception();
            }
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }
}
