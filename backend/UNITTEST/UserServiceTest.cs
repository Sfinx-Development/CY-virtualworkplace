using System;
using core;
using Interfaces;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

public class UserServiceTests
{
    [Fact]
    public async Task CreateUser_ValidUser_ReturnsUserWithAssignedUserId()
    {
        var userRepositoryMock = new Mock<IUserRepository>();
        var loggerServiceMock = new Mock<ILogger<UserService>>();

        userRepositoryMock
            .Setup(repo => repo.CreateAsync(It.IsAny<User>()))
            .ReturnsAsync(
                (User user) =>
                {
                    user.Id = Guid.NewGuid().ToString();
                    user.FirstName = "Elina";
                    user.LastName = "Kerola";
                    user.Email = "elinak90@icloud.com";
                    user.Password = "Hej123";
                    user.Gender = "Woman";
                    user.Age = 33;
                    user.PhoneNumber = "0812408112";
                    user.DateCreated = DateTime.UtcNow;
                    return user;
                }
            );

        var userService = new UserService(userRepositoryMock.Object, loggerServiceMock.Object);
        var userCreateDto = new UserCreateDTO
        {
            FirstName = "Elina",
            LastName = "Kerola",
            Email = "elinak90@icloud.com",
            Password = "Hej123",
            Gender = "Woman",
            Age = 33,
            PhoneNumber = "0812408112"
        };

        var user = await userService.Create(userCreateDto);

        Assert.NotNull(user.Id);
    }

    [Fact]
    public void GetUserById_ExistingUserId_ReturnsUser()
    {
        var userRepositoryMock = new Mock<IUserRepository>();
        var loggerServiceMock = new Mock<ILogger<UserService>>();
        userRepositoryMock
            .Setup(repo => repo.GetByIdAsync("123"))
            .ReturnsAsync(
                new User
                {
                    Id = "123",
                    FirstName = "Angelina",
                    LastName = "Holmqvist"
                }
            );

        var userService = new UserService(userRepositoryMock.Object, loggerServiceMock.Object);

        var user = userService.GetById("123");

        Assert.NotNull(user);
    }
}
