using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace core.Migrations
{
    /// <inheritdoc />
    public partial class profilefilestable2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder
                .CreateTable(
                    name: "ProjectFiles",
                    columns: table =>
                        new
                        {
                            Id = table
                                .Column<string>(type: "varchar(255)", nullable: false)
                                .Annotation("MySql:CharSet", "utf8mb4"),
                            FileName = table
                                .Column<string>(type: "longtext", nullable: false)
                                .Annotation("MySql:CharSet", "utf8mb4"),
                            Content = table.Column<byte[]>(type: "longblob", nullable: false),
                            UpdateCommentId = table
                                .Column<string>(type: "varchar(255)", nullable: false)
                                .Annotation("MySql:CharSet", "utf8mb4"),
                            FilePath = table
                                .Column<string>(type: "longtext", nullable: false)
                                .Annotation("MySql:CharSet", "utf8mb4")
                        },
                    constraints: table =>
                    {
                        table.PrimaryKey("PK_ProjectFiles", x => x.Id);
                        table.ForeignKey(
                            name: "FK_ProjectFiles_UpdateComments_UpdateCommentId",
                            column: x => x.UpdateCommentId,
                            principalTable: "UpdateComments",
                            principalColumn: "Id",
                            onDelete: ReferentialAction.Cascade
                        );
                    }
                )
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "MeetingOccasions");

            migrationBuilder.DropTable(name: "Messages");

            migrationBuilder.DropTable(name: "ProfileHealthChecks");

            migrationBuilder.DropTable(name: "ProjectFiles");

            migrationBuilder.DropTable(name: "Todos");

            migrationBuilder.DropTable(name: "Meetings");

            migrationBuilder.DropTable(name: "ConversationParticipants");

            migrationBuilder.DropTable(name: "HealthChecks");

            migrationBuilder.DropTable(name: "UpdateComments");

            migrationBuilder.DropTable(name: "Room");

            migrationBuilder.DropTable(name: "Conversations");

            migrationBuilder.DropTable(name: "ProjectUpdates");

            migrationBuilder.DropTable(name: "Profiles");

            migrationBuilder.DropTable(name: "Projects");

            migrationBuilder.DropTable(name: "Users");

            migrationBuilder.DropTable(name: "Teams");
        }
    }
}
