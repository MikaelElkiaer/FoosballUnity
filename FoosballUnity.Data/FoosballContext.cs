using FoosballUnity.Model;
using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace FoosballUnity.Data
{
    public class FoosballContext : DbContext
    {
        public FoosballContext(DbContextOptions options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ConfigurationItem>().HasKey(c => c.Name);
            modelBuilder.Entity<Game>().HasKey(g => g.Id);
            modelBuilder.Entity<Player>().HasKey(p => p.Name);
            modelBuilder.Entity<Registration>().HasKey(r => r.RfidTag);
            modelBuilder.Entity<TimerAction>().HasKey(t => t.Id);
        }

        public DbSet<ConfigurationItem> Configurations { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<Player> Players { get; set; }
        public DbSet<Registration> Registrations { get; set; }
        public DbSet<TimerAction> TimerActions { get; set; }
    }
}
