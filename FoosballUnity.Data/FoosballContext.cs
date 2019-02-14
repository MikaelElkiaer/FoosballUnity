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
            var game = modelBuilder.Entity<Game>();
            game.Property(g => g.Id).ValueGeneratedOnAdd();
            game.HasKey(g => g.Id);
            modelBuilder.Entity<Player>().HasKey(p => p.Name);
        }

        public DbSet<ConfigurationItem> Configurations { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<Player> Players { get; set; }
    }
}
