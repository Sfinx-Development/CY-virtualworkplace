using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace core;

public class CyDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Profile> Profiles { get; set; }
    public DbSet<Meeting> Meetings { get; set; }
    public DbSet<Team> Teams { get; set; }
    public DbSet<MeetingOccasion> MeetingOccasions { get; set; }
    public DbSet<Survey> Surveys { get; set; }
    public DbSet<ProfileToSurvey> ProfileToSurveys { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Conversation> Conversations { get; set; }
    public DbSet<ConversationParticipant> ConversationParticipants { get; set; }
    public DbSet<Todo> Todos { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<ProjectUpdate> ProjectUpdates { get; set; }
    public DbSet<UpdateComment> UpdateComments { get; set; }
    public DbSet<ProjectFile> ProjectFiles { get; set; }
    public DbSet<TeamRequest> TeamRequests { get; set; }

    public CyDbContext() { }

    public CyDbContext(DbContextOptions<CyDbContext> options)
        : base(options)
    {
        Database.EnsureCreated();
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        // if (!options.IsConfigured)
        // {
        //     var configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();

        //     var connectionString = configuration.GetConnectionString(
        //         configuration["Environment"] == "Development" ? "CyDbContextDev" : "CyDbContextProd"
        //     );

        //     options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
        // }
        //använd denna istället för att göra migration till lokala databasen:
        if (!options.IsConfigured)
        {
            options.UseMySql(
                "server=localhost;database=cy;user=root;password=",
                ServerVersion.AutoDetect("server=localhost;database=cy;user=root;password=")
            );
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MeetingOccasion>().HasOne(mo => mo.Meeting);
        modelBuilder.Entity<Survey>().HasOne(h => h.Team);
        modelBuilder.Entity<ProfileToSurvey>().HasOne(ph => ph.Profile);
        modelBuilder.Entity<ProfileToSurvey>().HasOne(ph => ph.Survey);
        modelBuilder.Entity<Todo>().HasOne(t => t.Team);
        modelBuilder.Entity<Profile>().HasOne(p => p.User).WithMany(u => u.Profiles);
        modelBuilder.Entity<Profile>().HasOne(p => p.Team).WithMany(t => t.Profiles);
        modelBuilder.Entity<MeetingOccasion>().HasOne(mo => mo.Profile);
        modelBuilder
            .Entity<ConversationParticipant>()
            .HasOne(cp => cp.Profile)
            .WithMany(p => p.ConversationParticipants);
        modelBuilder.Entity<ConversationParticipant>().HasOne(cp => cp.Conversation);
        modelBuilder.Entity<Conversation>().HasMany(c => c.Messages);
        modelBuilder.Entity<ProjectUpdate>().HasOne(p => p.Project);
        modelBuilder.Entity<UpdateComment>().HasOne(p => p.ProjectUpdate);
        modelBuilder.Entity<Project>().HasOne(p => p.Team);
        modelBuilder.Entity<ProjectFile>().HasOne(p => p.UpdateComment);
    }
}
