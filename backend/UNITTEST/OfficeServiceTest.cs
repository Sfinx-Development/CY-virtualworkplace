using System;
using core;
using Interfaces;
using Moq;
using Xunit;

public class OfficeServiceTest
{
    [Fact]
    public async Task OfficeCreatesWhenProfileCreates()
    {
        // mocka
        var profileRepositoryMock = new Mock<IProfileRepository>();
        var officeServiceMock = new Mock<IOfficeService>();
        var userRepositoryMock = new Mock<IUserRepository>();
        var officeRepositoryMock = new Mock<IOfficeRepository>();
        var teamRepositoryMock = new Mock<ITeamRepository>();

        // bestäm vad createasync ska returnera sen
        profileRepositoryMock
            .Setup(repo => repo.CreateAsync(It.IsAny<Profile>()))
            .ReturnsAsync(
                (Profile profile) =>
                {
                    profile.Id = "profile123";
                    return profile;
                }
            );

        officeServiceMock
            .Setup(service => service.CreateOffice(It.IsAny<Profile>()))
            .ReturnsAsync(
                (Profile profile) =>
                {
                    var office = new Office { ProfileId = profile.Id };
                    return office;
                }
            );

        var profileService = new ProfileService(
            profileRepositoryMock.Object,
            userRepositoryMock.Object,
            teamRepositoryMock.Object,
            officeServiceMock.Object
        );

        var team = new Team() { Id = "123" };

        var createdProfile = await profileService.CreateProfile(
            new User(),
            true,
            "scrum master",
            team
        );

        Assert.NotNull(createdProfile);

        officeServiceMock.Verify(
            service => service.CreateOffice(It.Is<Profile>(t => t.Id == createdProfile.Id)),
            Times.Once
        );
    }
}
