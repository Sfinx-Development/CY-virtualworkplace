using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace core.Migrations
{
    /// <inheritdoc />
    public partial class profilehealthcheck : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HealthChecks_Cys_CyId",
                table: "HealthChecks");

            migrationBuilder.DropColumn(
                name: "HealthAverageStat",
                table: "HealthChecks");

            migrationBuilder.RenameColumn(
                name: "HealthCheckTime",
                table: "HealthChecks",
                newName: "StartTime");

            migrationBuilder.AlterColumn<string>(
                name: "CyId",
                table: "HealthChecks",
                type: "varchar(255)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndTime",
                table: "HealthChecks",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Question",
                table: "HealthChecks",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "TeamId",
                table: "HealthChecks",
                type: "varchar(255)",
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ProfileHealthCheck",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Date = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    IsAnonymous = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    ProfileId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    HealthCheckId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfileHealthCheck", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProfileHealthCheck_HealthChecks_HealthCheckId",
                        column: x => x.HealthCheckId,
                        principalTable: "HealthChecks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProfileHealthCheck_Profiles_ProfileId",
                        column: x => x.ProfileId,
                        principalTable: "Profiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_HealthChecks_TeamId",
                table: "HealthChecks",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfileHealthCheck_HealthCheckId",
                table: "ProfileHealthCheck",
                column: "HealthCheckId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfileHealthCheck_ProfileId",
                table: "ProfileHealthCheck",
                column: "ProfileId");

            migrationBuilder.AddForeignKey(
                name: "FK_HealthChecks_Cys_CyId",
                table: "HealthChecks",
                column: "CyId",
                principalTable: "Cys",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_HealthChecks_Teams_TeamId",
                table: "HealthChecks",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HealthChecks_Cys_CyId",
                table: "HealthChecks");

            migrationBuilder.DropForeignKey(
                name: "FK_HealthChecks_Teams_TeamId",
                table: "HealthChecks");

            migrationBuilder.DropTable(
                name: "ProfileHealthCheck");

            migrationBuilder.DropIndex(
                name: "IX_HealthChecks_TeamId",
                table: "HealthChecks");

            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "HealthChecks");

            migrationBuilder.DropColumn(
                name: "Question",
                table: "HealthChecks");

            migrationBuilder.DropColumn(
                name: "TeamId",
                table: "HealthChecks");

            migrationBuilder.RenameColumn(
                name: "StartTime",
                table: "HealthChecks",
                newName: "HealthCheckTime");

            migrationBuilder.UpdateData(
                table: "HealthChecks",
                keyColumn: "CyId",
                keyValue: null,
                column: "CyId",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "CyId",
                table: "HealthChecks",
                type: "varchar(255)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "HealthAverageStat",
                table: "HealthChecks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_HealthChecks_Cys_CyId",
                table: "HealthChecks",
                column: "CyId",
                principalTable: "Cys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
