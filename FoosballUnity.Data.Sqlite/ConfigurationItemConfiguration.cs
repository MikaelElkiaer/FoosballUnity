using FoosballUnity.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace FoosballUnity.Data.Sqlite
{
    public class ConfigurationItemConfiguration : IEntityTypeConfiguration<ConfigurationItem>
    {
        public void Configure(EntityTypeBuilder<ConfigurationItem> b)
        {
            b.HasKey(p => p.Name);
            b.Property(p => p.Value);
        }
    }
}
