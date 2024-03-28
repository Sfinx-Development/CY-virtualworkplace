using System.Net;
using core;
using Interfaces;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Serilog.AspNetCore;

var builder = WebApplication.CreateBuilder(args);
var env = builder.Environment;
builder.Services.AddSignalR();

if (!env.IsDevelopment())
{
    Log.Logger = new LoggerConfiguration().WriteTo.File("log.txt").CreateLogger();
    builder.Logging.ClearProviders();
    builder.Logging.AddSerilog();
}

builder.Configuration.AddJsonFile("appsettings.json");

var allowedOrigins = builder
    .Configuration.GetSection("AllowedOrigins")
    .GetSection(env.EnvironmentName)
    .Get<string[]>();

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowAll",
        builder =>
        {
            builder
                .WithOrigins(allowedOrigins)
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        }
    );
});

if (env.IsDevelopment())
{
    builder.WebHost.UseUrls("http://0.0.0.0:5290");
}

var jwtConfig = builder.Configuration.GetSection("Jwt");
var securityKeyBytes = Convert.FromBase64String(jwtConfig["Secret"]);
var securityKey = new SymmetricSecurityKey(securityKeyBytes);
builder.Services.AddSingleton(securityKey);

builder.Services.AddControllers();
builder.Services.AddSignalR();

var connectionString = builder.Configuration.GetConnectionString(
    builder.Environment.IsDevelopment() ? "CyDbContextDev" : "CyDbContextProd"
);

builder.Services.AddDbContext<CyDbContext>(options =>
{
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITeamRepository, TeamRepository>();
builder.Services.AddScoped<IMeetingOccasionRepository, MeetingOccasionRepository>();
builder.Services.AddScoped<IMeetingRepository, MeetingRepository>();
builder.Services.AddScoped<IMeetingRoomRepository, MeetingRoomRepository>();
builder.Services.AddScoped<IOfficeRepository, OfficeRepository>();
builder.Services.AddScoped<IProfileRepository, ProfileRepository>();
builder.Services.AddScoped<IConversationRepository, ConversationRepository>();
builder.Services.AddScoped<IMessageRepository, MessageRepository>();
builder.Services.AddScoped<IHealthCheckRepository, HealthCheckRepository>();
builder.Services.AddScoped<IConversationParticipantRepository, ConversationParticipantRepository>();
builder.Services.AddScoped<IProfileHealthCheckRepository, ProfileHealthCheckRepository>();
builder.Services.AddScoped<LogInRepository>();
builder.Services.AddScoped<ITodoRepository, TodoRepository>();
builder.Services.AddScoped<IConversationParticipantRepository, ConversationParticipantRepository>();
builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
builder.Services.AddScoped<IProjectUpdateRepository, ProjectUpdateRepository>();
builder.Services.AddScoped<IUpdateCommentRepository, UpdateCommentRepository>();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<ITeamService, TeamService>();
builder.Services.AddScoped<IMeetingRoomService, MeetingRoomServie>();
builder.Services.AddScoped<IOfficeService, OfficeService>();
builder.Services.AddScoped<IMessageService, MessageService>();
builder.Services.AddScoped<IConversationParticipantService, ConversationParticipantService>();

builder.Services.AddScoped<IConversationService, ConversationService>();

builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<ILoginService, LogInService>();
builder.Services.AddScoped<IMeetingOccasionRepository, MeetingOccasionRepository>();
builder.Services.AddScoped<IMeetingOccasionService, MeetingOccasionService>();
builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<IMeetingService, MeetingService>();
builder.Services.AddScoped<IHealthCheckService, HealthCheckService>();
builder.Services.AddScoped<IProfileHealthCheckService, ProfileHealthCheckService>();
builder.Services.AddScoped<ITodoService, TodoService>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<IProjectUpdateService, ProjectUpdateService>();
builder.Services.AddScoped<IUpdateCommentService, UpdateCommentService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder
    .Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System
            .Text
            .Json
            .Serialization
            .ReferenceHandler
            .Preserve;
    });

builder
    .Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(
        "Bearer",
        options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                IssuerSigningKey = securityKey,
                ValidIssuer = builder.Configuration["Jwt:Issuer"],
                ValidAudience = builder.Configuration["Jwt:Audience"]
            };

            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    // hämtar jwtn från kakan
                    context.Token = context.Request.Cookies["jwttoken"];
                    return Task.CompletedTask;
                }
            };
        }
    );

builder.Services.AddAuthorization();

var app = builder.Build();
app.UseRouting();

app.MapHub<MeetingRoomHub>("/meetingroomhub");
app.MapHub<ChatHub>("/chathub");
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.MapControllers();

app.UseAuthentication();
app.UseAuthorization();

app.MapDefaultControllerRoute();

app.Run();
