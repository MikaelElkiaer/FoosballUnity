using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FoosballUnity.Data.Sqlite.Migrations
{
    public partial class AddedRemainingProperties : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedUtc",
                table: "Player",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "PlayerReady",
                table: "Player",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastUpdatedUtc",
                table: "Game",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "MatchWinner",
                table: "Game",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PlayerBlue1",
                table: "Game",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PlayerBlue2",
                table: "Game",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PlayerRed1",
                table: "Game",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PlayerRed2",
                table: "Game",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PointsAtStake",
                table: "Game",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "WinningTable",
                table: "Game",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Value",
                table: "ConfigurationItem",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedUtc",
                table: "Player");

            migrationBuilder.DropColumn(
                name: "PlayerReady",
                table: "Player");

            migrationBuilder.DropColumn(
                name: "LastUpdatedUtc",
                table: "Game");

            migrationBuilder.DropColumn(
                name: "MatchWinner",
                table: "Game");

            migrationBuilder.DropColumn(
                name: "PlayerBlue1",
                table: "Game");

            migrationBuilder.DropColumn(
                name: "PlayerBlue2",
                table: "Game");

            migrationBuilder.DropColumn(
                name: "PlayerRed1",
                table: "Game");

            migrationBuilder.DropColumn(
                name: "PlayerRed2",
                table: "Game");

            migrationBuilder.DropColumn(
                name: "PointsAtStake",
                table: "Game");

            migrationBuilder.DropColumn(
                name: "WinningTable",
                table: "Game");

            migrationBuilder.DropColumn(
                name: "Value",
                table: "ConfigurationItem");
        }
    }
}
