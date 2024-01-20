using System;
using core;
using Interfaces;
using Moq;
using Xunit;

public class MeetingOccasionServiceTest
{
    [Fact]
    public async Task EmptyListIfOccasionMeetingIsPastDate()
    {
        var meetingOccasionRepositoryMock = new Mock<IMeetingOccasionRepository>();
        var meetingRepositoryMock = new Mock<IMeetingRepository>();
        var profileRepositoryMock = new Mock<IProfileRepository>();

        var meetingOccasionService = new MeetingOccasionService(
            meetingOccasionRepositoryMock.Object,
            profileRepositoryMock.Object,
            meetingRepositoryMock.Object
        );

        var meeting = new Meeting
        {
            Id = "Meeting123",
            Date = DateTime.Now.AddDays(-1),
            IsRepeating = false
        };
        var profile = new Profile() { Id = "Profile123" };
        var pastNonRecurringMeetings = new List<MeetingOccasion>
        {
            new MeetingOccasion
            {
                Id = "Occasion123",
                Profile = profile,
                Meeting = meeting
            }
        };

        meetingOccasionRepositoryMock
            .Setup(x => x.GetAllOccasionsByProfileId(profile.Id))
            .ReturnsAsync(pastNonRecurringMeetings);

        // ACT
        var result = await meetingOccasionService.GetOccasionsByProfileId(profile.Id);

        // ASSERT
        Assert.Empty(result);
    }
}
