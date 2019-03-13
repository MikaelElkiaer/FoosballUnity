﻿// <auto-generated />
using System;
using FoosballUnity.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace FoosballUnity.Data.Sqlite.Migrations
{
    [DbContext(typeof(FoosballContext))]
    [Migration("20190313102445_InitialCreate")]
    partial class InitialCreate
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.1-servicing-10028");

            modelBuilder.Entity("FoosballUnity.Model.ConfigurationItem", b =>
                {
                    b.Property<string>("Name");

                    b.HasKey("Name");

                    b.ToTable("ConfigurationItem");
                });

            modelBuilder.Entity("FoosballUnity.Model.Game", b =>
                {
                    b.Property<int?>("Id")
                        .ValueGeneratedOnAdd();

                    b.HasKey("Id");

                    b.ToTable("Game");
                });

            modelBuilder.Entity("FoosballUnity.Model.Player", b =>
                {
                    b.Property<string>("Name");

                    b.HasKey("Name");

                    b.ToTable("Player");
                });
#pragma warning restore 612, 618
        }
    }
}