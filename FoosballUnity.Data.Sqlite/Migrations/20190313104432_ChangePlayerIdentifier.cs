using Microsoft.EntityFrameworkCore.Migrations;

namespace FoosballUnity.Data.Sqlite.Migrations
{
    public partial class ChangePlayerIdentifier : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Player",
                newName: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Player",
                newName: "Name");
        }
    }
}
