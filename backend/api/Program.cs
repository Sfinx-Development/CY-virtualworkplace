using System.Net;
using core;
using Interfaces;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowAll",
        builder =>
        {
            builder
                .WithOrigins("http://localhost:5173")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        }
    );
});

builder.WebHost.UseUrls("http://0.0.0.0:5290");

builder.Configuration.AddJsonFile("appsettings.json");

var jwtConfig = builder.Configuration.GetSection("Jwt");
var securityKeyBytes = Convert.FromBase64String(jwtConfig["Secret"]);
var securityKey = new SymmetricSecurityKey(securityKeyBytes);
builder.Services.AddSingleton(securityKey);

builder.Services.AddControllers();
builder.Services.AddSignalR();

builder.Services.AddDbContext<CyDbContext>(
    options =>
        options.UseMySql(
            "server=localhost;database=cy;user=root;password=",
            ServerVersion.AutoDetect("server=localhost;database=cy;user=root;password=")
        )
);

// if (!builder.Environment.IsDevelopment())
// {
//     builder.Services.AddHttpsRedirection(options =>
//     {
//         options.RedirectStatusCode = (int)HttpStatusCode.PermanentRedirect;
//         options.HttpsPort = 443;
//     });
// }

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITeamRepository, TeamRepository>();
builder.Services.AddScoped<IMeetingOccasionRepository, MeetingOccasionRepository>();
builder.Services.AddScoped<IMeetingRepository, MeetingRepository>();
builder.Services.AddScoped<IMeetingRoomRepository, MeetingRoomRepository>();
builder.Services.AddScoped<IOfficeRepository, OfficeRepository>();
builder.Services.AddScoped<IProfileRepository, ProfileRepository>();
builder.Services.AddScoped<IConversationRepository, ConversationRepository>();
builder.Services.AddScoped<IMessageRepository, MessageRepository>();
builder.Services.AddScoped<IConversationParticipantRepository, ConversationParticipantRepository>();
builder.Services.AddScoped<LogInRepository>();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<ITeamService, TeamService>();
builder.Services.AddScoped<IMeetingRoomService, MeetingRoomServie>();
builder.Services.AddScoped<IOfficeService, OfficeService>();
builder.Services.AddScoped<IMessageService, MessageService>();

builder.Services.AddScoped<IConversationService, ConversationService>();

builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<ILoginService, LogInService>();
builder.Services.AddScoped<IMeetingOccasionRepository, MeetingOccasionRepository>();
builder.Services.AddScoped<IMeetingOccasionService, MeetingOccasionService>();
builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<IMeetingService,MeetingService>();
builder.Services.AddScoped<ChatHub>();

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
var hubContext = app.Services.GetRequiredService<IHubContext<ChatHub>>();
app.UseCors("AllowAll");

app.MapControllers();

app.UseAuthentication();
app.UseAuthorization();

app.MapDefaultControllerRoute();

app.Run();
