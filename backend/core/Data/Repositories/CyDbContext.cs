using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace core;

public class CyDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Meeting> Meetings { get; set; }
    public DbSet<Team> Teams { get; set; }
    public DbSet<Office> Offices { get; set; }
    public DbSet<MeetingRoom> MeetingRooms { get; set; }
    public DbSet<MeetingOccasion> MeetingOccasions { get; set; }
    public DbSet<HealthCheck> HealthChecks { get; set; }
    public DbSet<Cy> Cys { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Conversation> Conversations { get; set; }

    public CyDbContext() { }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.UseMySql(
            "server=localhost;database=cy;user=root;password=",
            ServerVersion.AutoDetect("server=localhost;database=cy;user=root;password=")
        );
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasMany(u => u.Teams).WithMany(t => t.Users);

        modelBuilder.Entity<Office>().HasOne(o => o.User);
        modelBuilder.Entity<Office>().HasOne(o => o.Cy);

        modelBuilder.Entity<MeetingRoom>().HasOne(mr => mr.Team);
        modelBuilder.Entity<MeetingRoom>().HasOne(mr => mr.Cy);

        modelBuilder.Entity<MeetingOccasion>().HasOne(mo => mo.User);
        modelBuilder.Entity<MeetingOccasion>().HasOne(mo => mo.Meeting);

        modelBuilder.Entity<HealthCheck>().HasOne(mo => mo.Cy).WithMany(c => c.HealthChecks);

        modelBuilder.Entity<Message>().HasOne(me => me.Sender);
        modelBuilder.Entity<Message>().HasOne(me => me.Conversation).WithMany(c => c.Messages);

        modelBuilder.Entity<Conversation>().HasOne(c => c.Creator);
        modelBuilder.Entity<Conversation>().HasMany(c => c.Participants);
    }
}
