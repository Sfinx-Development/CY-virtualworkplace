using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace core;

public class CyDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Meeting> Meetings { get; set; }
    public DbSet<Team> Teams { get; set; }

    public CyDbContext() { }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.UseMySql(
            "server=localhost;database=cy;user=root;password=",
            ServerVersion.AutoDetect("server=localhost;database=cy;user=root;password=")
        );
    }
}
