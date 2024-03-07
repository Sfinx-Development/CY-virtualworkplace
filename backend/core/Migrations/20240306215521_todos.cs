using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace core.Migrations
{
    /// <inheritdoc />
    public partial class todos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HealthChecks_Cys_CyId",
                table: "HealthChecks");

            migrationBuilder.DropForeignKey(
                name: "FK_Room_Cys_CyId",
                table: "Room");

            migrationBuilder.DropTable(
                name: "Cys");

            migrationBuilder.DropIndex(
                name: "IX_Room_CyId",
                table: "Room");

            migrationBuilder.DropIndex(
                name: "IX_HealthChecks_CyId",
                table: "HealthChecks");

            migrationBuilder.DropColumn(
                name: "CyId",
                table: "Room");

            migrationBuilder.DropColumn(
                name: "CyId",
                table: "HealthChecks");

            migrationBuilder.CreateTable(
                name: "Todos",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Title = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Date = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    TeamId = table.Column<string>(type: "varchar(255)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Todos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Todos_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Todos_TeamId",
                table: "Todos",
                column: "TeamId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Todos");

            migrationBuilder.AddColumn<string>(
                name: "CyId",
                table: "Room",
                type: "varchar(255)",
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "CyId",
                table: "HealthChecks",
                type: "varchar(255)",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Cys",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    HealthCheckInterval = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cys", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Room_CyId",
                table: "Room",
                column: "CyId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthChecks_CyId",
                table: "HealthChecks",
                column: "CyId");

            migrationBuilder.AddForeignKey(
                name: "FK_HealthChecks_Cys_CyId",
                table: "HealthChecks",
                column: "CyId",
                principalTable: "Cys",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Room_Cys_CyId",
                table: "Room",
                column: "CyId",
                principalTable: "Cys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
