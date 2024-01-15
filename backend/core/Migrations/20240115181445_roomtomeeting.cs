using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace core.Migrations
{
    /// <inheritdoc />
    public partial class roomtomeeting : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Offices_Cys_CyId",
                table: "Offices");

            migrationBuilder.DropForeignKey(
                name: "FK_Offices_Profiles_ProfileId",
                table: "Offices");

            migrationBuilder.DropTable(
                name: "MeetingRooms");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Offices",
                table: "Offices");

            migrationBuilder.RenameTable(
                name: "Offices",
                newName: "Room");

            migrationBuilder.RenameIndex(
                name: "IX_Offices_ProfileId",
                table: "Room",
                newName: "IX_Room_ProfileId");

            migrationBuilder.RenameIndex(
                name: "IX_Offices_CyId",
                table: "Room",
                newName: "IX_Room_CyId");

            migrationBuilder.AddColumn<string>(
                name: "RoomId",
                table: "Meetings",
                type: "varchar(255)",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "Room",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "TeamId",
                table: "Room",
                type: "varchar(255)",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Room",
                table: "Room",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Meetings_RoomId",
                table: "Meetings",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_Room_TeamId",
                table: "Room",
                column: "TeamId");

            migrationBuilder.AddForeignKey(
                name: "FK_Meetings_Room_RoomId",
                table: "Meetings",
                column: "RoomId",
                principalTable: "Room",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Room_Cys_CyId",
                table: "Room",
                column: "CyId",
                principalTable: "Cys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Room_Profiles_ProfileId",
                table: "Room",
                column: "ProfileId",
                principalTable: "Profiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Room_Teams_TeamId",
                table: "Room",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Meetings_Room_RoomId",
                table: "Meetings");

            migrationBuilder.DropForeignKey(
                name: "FK_Room_Cys_CyId",
                table: "Room");

            migrationBuilder.DropForeignKey(
                name: "FK_Room_Profiles_ProfileId",
                table: "Room");

            migrationBuilder.DropForeignKey(
                name: "FK_Room_Teams_TeamId",
                table: "Room");

            migrationBuilder.DropIndex(
                name: "IX_Meetings_RoomId",
                table: "Meetings");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Room",
                table: "Room");

            migrationBuilder.DropIndex(
                name: "IX_Room_TeamId",
                table: "Room");

            migrationBuilder.DropColumn(
                name: "RoomId",
                table: "Meetings");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "Room");

            migrationBuilder.DropColumn(
                name: "TeamId",
                table: "Room");

            migrationBuilder.RenameTable(
                name: "Room",
                newName: "Offices");

            migrationBuilder.RenameIndex(
                name: "IX_Room_ProfileId",
                table: "Offices",
                newName: "IX_Offices_ProfileId");

            migrationBuilder.RenameIndex(
                name: "IX_Room_CyId",
                table: "Offices",
                newName: "IX_Offices_CyId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Offices",
                table: "Offices",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "MeetingRooms",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CyId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TeamId = table.Column<string>(type: "varchar(255)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    RoomLayout = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeetingRooms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MeetingRooms_Cys_CyId",
                        column: x => x.CyId,
                        principalTable: "Cys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MeetingRooms_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingRooms_CyId",
                table: "MeetingRooms",
                column: "CyId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingRooms_TeamId",
                table: "MeetingRooms",
                column: "TeamId");

            migrationBuilder.AddForeignKey(
                name: "FK_Offices_Cys_CyId",
                table: "Offices",
                column: "CyId",
                principalTable: "Cys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Offices_Profiles_ProfileId",
                table: "Offices",
                column: "ProfileId",
                principalTable: "Profiles",
                principalColumn: "Id");
        }
    }
}
