using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace core.Migrations
{
    /// <inheritdoc />
    public partial class owneronmeeting : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsMeetingOwner",
                table: "MeetingOccasions");

            migrationBuilder.AddColumn<string>(
                name: "OwnerId",
                table: "Meetings",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "Meetings");

            migrationBuilder.AddColumn<bool>(
                name: "IsMeetingOwner",
                table: "MeetingOccasions",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }
    }
}
