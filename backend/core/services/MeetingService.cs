using Interfaces;
using System;
namespace core;


public class MeetingService
{
    private readonly IMeetingRepository _meetingRepository;
    private readonly IProfileRepository _profileRepository;
    private readonly IRoomService _roomService;
    private readonly IMeetingOccasionRepository _meetingOccasionRepository;

    public MeetingService(
        IMeetingRepository meetingRepository,
        IProfileRepository profileRepository,
        IRoomService roomService,
        IMeetingOccasionRepository meetingOccasionRepository
    )
    {
        _meetingRepository = meetingRepository;
        _profileRepository = profileRepository;
        _roomService = roomService;
        _meetingOccasionRepository = meetingOccasionRepository;
    }

    public async Task<Meeting> CreateTeamMeetingAsync(IncomingMeetingDTO incomingMeetingDTO)
    {
        try
        {
            Room room = await _roomService.GetRoomById(incomingMeetingDTO.RoomId);
            Profile profile = await _profileRepository.GetByIdAsync(incomingMeetingDTO.OwnerId);

            //add hours är bara SÅLÄNGE tills vi vet hur man serialiserar date -> datetime korrekt
            Meeting meeting =
                new()
                {
                    Id = Utils.GenerateRandomId(),
                    Name = incomingMeetingDTO.Name,
                    Description = incomingMeetingDTO.Description,
                    Date = incomingMeetingDTO.Date.AddHours(1),
                    Minutes = incomingMeetingDTO.Minutes,
                    Room = room,
                    OwnerId = incomingMeetingDTO.OwnerId,
                    IsRepeating = incomingMeetingDTO.IsRepeating,
                    Interval = incomingMeetingDTO.Interval,
                    EndDate = incomingMeetingDTO.EndDate,
                    TeamId = profile.TeamId
                };


            Meeting createdMeeting = await _meetingRepository.CreateAsync(meeting);

            // MeetingOccasion ownersOccasion =
            //     new()
            //     {
            //         Id = Utils.GenerateRandomId(),
            //         Profile = profile,
            //         Meeting = meeting
            //     };
            // await _meetingOccasionRepository.CreateAsync(ownersOccasion);
            var profiles = await _profileRepository.GetProfilesInTeamAsync(profile.TeamId);

            foreach (Profile p in profiles)
            {
                MeetingOccasion profileOccasion =
            new()
            {
                Id = Utils.GenerateRandomId(),
                Profile = p,
                Meeting = meeting
            };
                await _meetingOccasionRepository.CreateAsync(profileOccasion);
            }

            return createdMeeting;
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task<Meeting> CreateAsync(IncomingMeetingDTO incomingMeetingDTO)
    {
        try
        {
            Room room = await _roomService.GetRoomById(incomingMeetingDTO.RoomId);
            Profile profile = await _profileRepository.GetByIdAsync(incomingMeetingDTO.OwnerId);

            //add hours är bara SÅLÄNGE tills vi vet hur man serialiserar date -> datetime korrekt
            Meeting meeting =
                new()
                {
                    Id = Utils.GenerateRandomId(),
                    Name = incomingMeetingDTO.Name,
                    Description = incomingMeetingDTO.Description,
                    Date = incomingMeetingDTO.Date.AddHours(1),
                    Minutes = incomingMeetingDTO.Minutes,
                    Room = room,
                    OwnerId = incomingMeetingDTO.OwnerId,
                    IsRepeating = incomingMeetingDTO.IsRepeating,
                    Interval = incomingMeetingDTO.Interval,
                    EndDate = incomingMeetingDTO.EndDate
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
            foundMeeting.Interval = meeting.Interval;
            foundMeeting.EndDate = meeting.EndDate;
            var updatedMeeting = await _meetingRepository.UpdateAsync(foundMeeting);
            return updatedMeeting;
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task<Meeting> GetMeetingByTeamId(string teamId)
    {
        try
        {
            var meetings = await _meetingRepository.GetByIdAsync(teamId);

            if (meetings == null)
            {
                throw new Exception("meetingroom can't be found");
            }
            else
            {
                return meetings;
            }
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task DeleteMeetingAndOccasions(string meetingId, string loggedInUserId)
    {
        try
        {

            var meeting = await _meetingRepository.GetByIdAsync(meetingId);
            var profile = await _profileRepository.GetByIdAsync(meeting.OwnerId);
            if (profile.UserId == loggedInUserId)
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
            else{
                throw new Exception("Only owner can delete meeting");
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
