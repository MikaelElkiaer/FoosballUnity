using FoosballUnity.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace FoosballUnity.Data.Sqlite
{
    public class PlayerConfiguration : IEntityTypeConfiguration<Player>
    {
        public void Configure(EntityTypeBuilder<Player> b)
        {
            b.HasKey(p => p.Id);
            b.Property(p => p.CreatedUtc);
            b.Property(p => p.PlayerReady);
        }
    }
}
