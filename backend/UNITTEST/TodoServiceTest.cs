using System;
using System.Threading.Tasks;
using core;
using Interfaces;
using Moq;
using Moq.Protected;
using Xunit;

public class TodoServiceTest
{
    [Fact]
    public async Task CreateTodo_ShouldCreateTodo_WhenValidInput()
    {
        
        var profileRepositoryMock = new Mock<IProfileRepository>();
        var teamRepositoryMock = new Mock<ITeamRepository>();
        var healthCheckRepositoryMock = new Mock<IHealthCheckRepository>();
        var profileHealthCheckRepositoryMock = new Mock<IProfileHealthCheckRepository>();
        var todoRepositoryMock = new Mock<ITodoRepository>();

        var todoService = new TodoService(
            profileRepositoryMock.Object,
            healthCheckRepositoryMock.Object,
            teamRepositoryMock.Object,
            profileHealthCheckRepositoryMock.Object,
            todoRepositoryMock.Object
        );

        var loggedInUser = new User { Id = "userId123" };
        var todoDTO = new TodoDTO
        {
            TeamId = "team123",
            Description = "Test Description",
            Title = "Test Title",
            Date = DateTime.UtcNow
        };

        profileRepositoryMock
            .Setup(repo => repo.GetByUserAndTeamIdAsync(It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync(new Profile { Id = "owner123", IsOwner = true });

        todoRepositoryMock
            .Setup(repo => repo.CreateAsync(It.IsAny<Todo>()))
            .ReturnsAsync(new Todo { Id = "testTodoId" });

        var createdTodoDTO = await todoService.CreateTodo(todoDTO, loggedInUser);

        Assert.NotNull(createdTodoDTO);
        Assert.Equal("testTodoId", createdTodoDTO.Id);
    }

    [Fact]
    public async Task UpdateTodo_ShouldUpdateTodo_WhenValidInput()
    {
        var profileRepositoryMock = new Mock<IProfileRepository>();
        var teamRepositoryMock = new Mock<ITeamRepository>();
        var healthCheckRepositoryMock = new Mock<IHealthCheckRepository>();
        var profileHealthCheckRepositoryMock = new Mock<IProfileHealthCheckRepository>();
        var todoRepositoryMock = new Mock<ITodoRepository>();

        var todoService = new TodoService(
            profileRepositoryMock.Object,
            healthCheckRepositoryMock.Object,
            teamRepositoryMock.Object,
            profileHealthCheckRepositoryMock.Object,
            todoRepositoryMock.Object
        );
         var loggedInUser = new User { Id = "userId123" };

        var todoDTO = new TodoDTO
        {
            Id = "testTodoId",
            Title = "Updated Title",
            Description = "Updated Description",
            Date = DateTime.UtcNow
        };

        todoRepositoryMock
            .Setup(repo => repo.GetByIdAsync(It.IsAny<string>()))
            .ReturnsAsync(new Todo { Id = "testTodoId", Title = "Original Title" });

        todoRepositoryMock
            .Setup(repo => repo.UpdateAsync(It.IsAny<Todo>()))
            .ReturnsAsync(new Todo { Id = "testTodoId", Title = "Updated Title" });
    
        var updatedTodo = await todoService.UpdateTodo(todoDTO, loggedInUser);
  
        Assert.NotNull(updatedTodo);
        Assert.Equal("Updated Title", updatedTodo.Title);
    }

}
