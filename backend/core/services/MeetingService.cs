using System;
using Interfaces;

namespace core;

public class MeetingService : IMeetingService
{
    private readonly IMeetingRepository _meetingRepository;
    private readonly IProfileRepository _profileRepository;
    private readonly IMeetingOccasionRepository _meetingOccasionRepository;

    public MeetingService(
        IMeetingRepository meetingRepository,
        IProfileRepository profileRepository,
        IMeetingOccasionRepository meetingOccasionRepository
    )
    {
        _meetingRepository = meetingRepository;
        _profileRepository = profileRepository;
        _meetingOccasionRepository = meetingOccasionRepository;
    }

    public async Task<OutgoingMeetingDTO> CreateTeamMeetingAsync(
        CreateMeetingDTO incomingMeetingDTO,
        User loggedInUser
    )
    {
        try
        {
            if (await _meetingRepository.IsOverLappedMeetings(incomingMeetingDTO))
            {
                throw new Exception("Overlapped meetings");
            }
            bool canCreate = false;

            Profile profile = await _profileRepository.GetByUserAndTeamIdAsync(
                loggedInUser.Id,
                incomingMeetingDTO.TeamId
            );

            if (profile.Team.AllCanCreateMeetings)
            {
                canCreate = true;
            }
            else
            {
                if (loggedInUser.Profiles.Any(p => p.Id == incomingMeetingDTO.OwnerId))
                {
                    canCreate = true;
                }
            }

            //add hours är bara SÅLÄNGE tills vi vet hur man serialiserar date -> datetime korrekt
            if (!canCreate)
            {
                throw new Exception("Not allowed to create meeting.");
            }
            Meeting meeting =
                new()
                {
                    Id = Utils.GenerateRandomId(),
                    Name = incomingMeetingDTO.Name,
                    Description = incomingMeetingDTO.Description,
                    Date = incomingMeetingDTO.Date.AddHours(2),
                    Minutes = incomingMeetingDTO.Minutes,
                    OwnerId = incomingMeetingDTO.OwnerId,
                    IsRepeating = incomingMeetingDTO.IsRepeating,
                    Interval = incomingMeetingDTO.Interval,
                    EndDate = incomingMeetingDTO.EndDate,
                    TeamId = profile.TeamId,
                };

            Meeting createdMeeting = await _meetingRepository.CreateAsync(meeting);

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
            OutgoingMeetingDTO outgoingMeetingDTO =
                new(
                    createdMeeting.Id,
                    createdMeeting.Name,
                    createdMeeting.Description,
                    createdMeeting.Date,
                    createdMeeting.Minutes,
                    createdMeeting.IsRepeating,
                    createdMeeting.OwnerId,
                    createdMeeting.Interval,
                    createdMeeting.EndDate
                );

            return outgoingMeetingDTO;
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task<OutgoingMeetingDTO> CreateAsync(CreateMeetingDTO incomingMeetingDTO)
    {
        try
        {
            Profile profile = await _profileRepository.GetByIdAsync(incomingMeetingDTO.OwnerId);

            //add hours är bara SÅLÄNGE tills vi vet hur man serialiserar date -> datetime korrekt
            Meeting meeting =
                new()
                {
                    Id = Utils.GenerateRandomId(),
                    Name = incomingMeetingDTO.Name,
                    Description = incomingMeetingDTO.Description,
                    Date = incomingMeetingDTO.Date.AddHours(2),
                    Minutes = incomingMeetingDTO.Minutes,
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

            OutgoingMeetingDTO outgoingMeetingDTO =
                new(
                    createdMeeting.Id,
                    createdMeeting.Name,
                    createdMeeting.Description,
                    createdMeeting.Date,
                    createdMeeting.Minutes,
                    createdMeeting.IsRepeating,
                    createdMeeting.OwnerId,
                    createdMeeting.Interval,
                    createdMeeting.EndDate
                );

            return outgoingMeetingDTO;
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task<OutgoingMeetingDTO> UpdateMeeting(IncomingMeetingDTO meeting)
    {
        try
        {
            var foundMeeting =
                await _meetingRepository.GetByIdAsync(meeting.Id) ?? throw new Exception();

            foundMeeting.Name = meeting.Name ?? foundMeeting.Name;
            foundMeeting.Description = meeting.Description ?? foundMeeting.Description;
            foundMeeting.Date = meeting.Date.AddHours(2);
            foundMeeting.Minutes = meeting.Minutes;
            foundMeeting.IsRepeating = meeting.IsRepeating;
            foundMeeting.Interval = meeting.Interval;
            foundMeeting.EndDate = meeting.EndDate;
            var updatedMeeting = await _meetingRepository.UpdateAsync(foundMeeting);
            OutgoingMeetingDTO outgoingMeetingDTO =
                new(
                    updatedMeeting.Id,
                    updatedMeeting.Name,
                    updatedMeeting.Description,
                    updatedMeeting.Date,
                    updatedMeeting.Minutes,
                    updatedMeeting.IsRepeating,
                    updatedMeeting.OwnerId,
                    updatedMeeting.Interval,
                    updatedMeeting.EndDate
                );
            return outgoingMeetingDTO;
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task<OutgoingMeetingDTO> GetMeetingByTeamId(string teamId)
    {
        try
        {
            var meeting = await _meetingRepository.GetByIdAsync(teamId);

            if (meeting == null)
            {
                throw new Exception("meeting can't be found");
            }
            else
            {
                OutgoingMeetingDTO outgoingMeetingDTO =
                    new(
                        meeting.Id,
                        meeting.Name,
                        meeting.Description,
                        meeting.Date,
                        meeting.Minutes,
                        meeting.IsRepeating,
                        meeting.OwnerId,
                        meeting.Interval,
                        meeting.EndDate
                    );
                return outgoingMeetingDTO;
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
            else
            {
                throw new Exception("Only owner can delete meeting");
            }
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }

    public async Task<OutgoingMeetingDTO> GetById(string meetingId, string userId)
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
                OutgoingMeetingDTO outgoingMeetingDTO =
                    new(
                        meeting.Id,
                        meeting.Name,
                        meeting.Description,
                        meeting.Date,
                        meeting.Minutes,
                        meeting.IsRepeating,
                        meeting.OwnerId,
                        meeting.Interval,
                        meeting.EndDate
                    );
                return outgoingMeetingDTO;
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

    public async Task<List<OutgoingMeetingDTO>> GetMeetingsByProfile(
        string profileId,
        User loggedInUser
    )
    {
        try
        {
            var profile = await _profileRepository.GetByIdAsync(profileId);
            if (profile.UserId != loggedInUser.Id)
            {
                throw new Exception("Not correct user");
            }
            var meetings = await _meetingRepository.GetAllByTeam(profile.TeamId);
            var outgoingMeetingDTOs = new List<OutgoingMeetingDTO>();
            outgoingMeetingDTOs = meetings
                .Select(
                    m =>
                        new OutgoingMeetingDTO(
                            m.Id,
                            m.Name,
                            m.Description,
                            m.Date,
                            m.Minutes,
                            m.IsRepeating,
                            m.OwnerId,
                            m.Interval,
                            m.EndDate
                        )
                )
                .ToList();
            return outgoingMeetingDTOs;
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    // I MeetingService.cs

    // I MeetingService.cs

    // I MeetingService.cs

    // I MeetingService.cs

    // private bool MeetingTimeOverlaps(Meeting meeting1, Meeting meeting2)
    // {
    //     return (meeting1.Date < meeting2.Date.AddMinutes(meeting2.Minutes) &&
    //             meeting2.Date < meeting1.Date.AddMinutes(meeting1.Minutes));
    // }


    public async Task<List<OutgoingMeetingDTO>> GetTeamMeetingsInPeriodAsync(
        string teamId,
        DateTime startDateTime,
        DateTime? endDateTime
    )
    {
        try
        {
            // Hämta möten för teamet i den angivna tidsperioden
            var teamMeetings = await _meetingRepository.GetAllByTeam(teamId);
            teamMeetings.ForEach(m => Console.WriteLine("MÖTESDATUM: " + m.Date));

            // Använd endDateTime direkt, den kan vara null
            var overlappingMeetings = teamMeetings
                .Where(m => startDateTime < m.Date.AddMinutes(m.Minutes) && m.Date < endDateTime)
                .ToList();

            var outgoingMeetingDTOs = new List<OutgoingMeetingDTO>();
            outgoingMeetingDTOs = overlappingMeetings
                .Select(
                    m =>
                        new OutgoingMeetingDTO(
                            m.Id,
                            m.Name,
                            m.Description,
                            m.Date,
                            m.Minutes,
                            m.IsRepeating,
                            m.OwnerId,
                            m.Interval,
                            m.EndDate
                        )
                )
                .ToList();
            return outgoingMeetingDTOs;
        }
        catch (Exception ex)
        {
            // Logga felmeddelandet eller returnera ett lämpligt felmeddelande
            // med ytterligare information om felet.
            // Log.Error($"An error occurred in GetTeamMeetingsInPeriodAsync: {ex}");
            throw new InvalidOperationException(
                "Failed to get team meetings in the specified period.",
                ex
            );
        }
    }
}
