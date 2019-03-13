using FoosballUnity.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace FoosballUnity.Data.Sqlite
{
    public class GameConfiguration : IEntityTypeConfiguration<Game>
    {
        public void Configure(EntityTypeBuilder<Game> b)
        {
            b.Property(p => p.Id).ValueGeneratedOnAdd();
            b.HasKey(p => p.Id);
            b.Property(p => p.LastUpdatedUtc);
            b.Property(p => p.MatchWinner);
            b.Property(p => p.PlayerBlue1);
            b.Property(p => p.PlayerBlue2);
            b.Property(p => p.PlayerRed1);
            b.Property(p => p.PlayerRed2);
            b.Property(p => p.PointsAtStake);
            b.Property(p => p.WinningTable);
        }
    }
}
