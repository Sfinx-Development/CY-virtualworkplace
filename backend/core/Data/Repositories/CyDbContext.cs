using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace core;

public class CyDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Profile> Profiles { get; set; }
    public DbSet<Meeting> Meetings { get; set; }
    public DbSet<Team> Teams { get; set; }
    public DbSet<Office> Offices { get; set; }
    public DbSet<MeetingRoom> MeetingRooms { get; set; }
    public DbSet<MeetingOccasion> MeetingOccasions { get; set; }
    public DbSet<HealthCheck> HealthChecks { get; set; }
    public DbSet<ProfileHealthCheck> ProfileHealthChecks { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Conversation> Conversations { get; set; }
    public DbSet<ConversationParticipant> ConversationParticipants { get; set; }
    public DbSet<Todo> Todos { get; set; }

    public CyDbContext() { }

    public CyDbContext(DbContextOptions<CyDbContext> options)
        : base(options)
    {
        Database.EnsureCreated();
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.UseMySql(
            // "server=localhost;database=cy;user=root;password=",
            "server=cydb.mysql.database.azure.com;database=cy;user=angelinaholmqvist;password=BellaKattis123",
            ServerVersion.AutoDetect(
                "server=cydb.mysql.database.azure.com;database=cy;user=angelinaholmqvist;password=BellaKattis123"
            )
        );
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Office>().HasOne(o => o.Profile);

        modelBuilder.Entity<MeetingRoom>().HasOne(mr => mr.Team);

        modelBuilder.Entity<MeetingOccasion>().HasOne(mo => mo.Meeting);

        //with many healthchecks?
        modelBuilder.Entity<HealthCheck>().HasOne(h => h.Team);
        modelBuilder.Entity<ProfileHealthCheck>().HasOne(ph => ph.Profile);
        modelBuilder.Entity<ProfileHealthCheck>().HasOne(ph => ph.HealthCheck);

        modelBuilder.Entity<Todo>().HasOne(t => t.Team);

        modelBuilder.Entity<Profile>().HasOne(p => p.User).WithMany(u => u.Profiles);
        modelBuilder.Entity<Profile>().HasOne(p => p.Team).WithMany(t => t.Profiles);

        modelBuilder.Entity<Meeting>().HasOne(m => m.Room);
        modelBuilder.Entity<MeetingOccasion>().HasOne(mo => mo.Profile);

        modelBuilder
            .Entity<ConversationParticipant>()
            .HasOne(cp => cp.Profile)
            .WithMany(p => p.ConversationParticipants);

        modelBuilder.Entity<ConversationParticipant>().HasOne(cp => cp.Conversation);

        modelBuilder.Entity<Conversation>().HasMany(c => c.Messages);
    }
}
