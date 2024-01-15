namespace core;

using Interfaces;

public class MeetingService
{
    private readonly IMeetingRepository _meetingRepository;
    private readonly RoomService _roomService;

    public MeetingService(IMeetingRepository meetingRepository, RoomService roomService)
    {
        _meetingRepository = meetingRepository;
        _roomService = roomService;
    }

    public async Task<Meeting> CreateAsync(IncomingMeetingDTO incomingMeetingDTO)
    {
        try
        {
            Room room = await _roomService.GetRoomById(incomingMeetingDTO.RoomId);

            Meeting meeting =
                new()
                {
                    Id = Utils.GenerateRandomId(),
                    Name = incomingMeetingDTO.Name,
                    Description = incomingMeetingDTO.Description,
                    Date = incomingMeetingDTO.Date,
                    Minutes = incomingMeetingDTO.Minutes,
                    IsRepeating = incomingMeetingDTO.IsRepeating,
                    Room = room
                };

            Meeting createdMeeting = await _meetingRepository.CreateAsync(meeting);

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
            var updatedMeeting = await _meetingRepository.UpdateAsync(foundMeeting);
            return updatedMeeting;
        }
        catch (Exception)
        {
            throw new Exception();
        }
    }
}
