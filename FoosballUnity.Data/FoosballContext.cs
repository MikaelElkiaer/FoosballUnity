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

        public DbSet<ConfigurationItem> Configurations { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<Player> Players { get; set; }
    }
}
