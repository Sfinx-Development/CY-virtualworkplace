using System;
using core;
using Interfaces;
using Moq;
using Xunit;
using Xunit.Abstractions;

public class MeetingServiceTest
{
    private readonly ITestOutputHelper _output;

    public MeetingServiceTest(ITestOutputHelper output)
    {
        _output = output;
    }

    [Fact]
    public async Task OccasionCreatesWhenCreatingMeeting()
    {
        // ARRANGE
        var meetingRepositoryMock = new Mock<IMeetingRepository>();
        var profileRepositoryMock = new Mock<IProfileRepository>();
        var meetingOccasionRepositoryMock = new Mock<IMeetingOccasionRepository>();

        var meetingService = new MeetingService(
            meetingRepositoryMock.Object,
            profileRepositoryMock.Object,
            meetingOccasionRepositoryMock.Object
        );

        var incomingMeetingDTO = new CreateMeetingDTO
        {
            Name = "TestMeeting",
            Description = "A meeting for testing",
            Date = DateTime.Now,
            Minutes = 10,
            IsRepeating = false,
            OwnerId = "Profile123",
            Interval = 0,
            EndDate = DateTime.Now
        };

        var profile = new Profile { Id = "Profile123" };

        profileRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<string>())).ReturnsAsync(profile);

        meetingRepositoryMock
            .Setup(x => x.CreateAsync(It.IsAny<Meeting>()))
            .ReturnsAsync(new Meeting());

        // Act
        var createdMeeting = await meetingService.CreateAsync(incomingMeetingDTO);

        // create async kallades met ett mötesobjekt
        meetingOccasionRepositoryMock
            .Setup(x => x.CreateAsync(It.IsAny<MeetingOccasion>()))
            .Callback<MeetingOccasion>(occasion =>
            {
                // kollar så att meetingoccasion har rätt properties
                Assert.NotNull(occasion);
            })
            .ReturnsAsync(new MeetingOccasion()); //ska returnera ett occasion

        Assert.NotNull(createdMeeting);

        // verifierar bara att metoden kallades på i testet
        meetingOccasionRepositoryMock.Verify(
            x => x.CreateAsync(It.IsAny<MeetingOccasion>()),
            Times.Once
        );
    }
}
