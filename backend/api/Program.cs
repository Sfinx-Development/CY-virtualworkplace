using System.Text;
using core;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using services;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://0.0.0.0:5290");

builder.Configuration.AddJsonFile("appsettings.json");

var jwtConfig = builder.Configuration.GetSection("Jwt");
var securityKeyBytes = Convert.FromBase64String(jwtConfig["Secret"]);
var securityKey = new SymmetricSecurityKey(securityKeyBytes);
builder.Services.AddSingleton(securityKey);

builder.Services.AddControllers();

// builder.Services.AddScoped<ILogInDB<User>, LogInDB>();
// builder.Services.AddScoped<IDataToObject<User, User>, UsersDB>();
// builder.Services.AddScoped<ILogInManager<OutgoingLogInDTO>, LogInServiceForDTO>();
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<LogInService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

builder
    .Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
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
    });

// builder.Services.AddScoped<ILogInManager<OutgoingLogInDTO>>(
//     provider => new LogInServiceForDTO(provider.GetRequiredService<ILogInDB<User>>(), securityKey)
// );

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
