using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace core.Migrations
{
    /// <inheritdoc />
    public partial class healthcheckid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProfileHealthCheck_HealthChecks_HealthCheckId",
                table: "ProfileHealthCheck");

            migrationBuilder.DropForeignKey(
                name: "FK_ProfileHealthCheck_Profiles_ProfileId",
                table: "ProfileHealthCheck");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProfileHealthCheck",
                table: "ProfileHealthCheck");

            migrationBuilder.RenameTable(
                name: "ProfileHealthCheck",
                newName: "ProfileHealthChecks");

            migrationBuilder.RenameIndex(
                name: "IX_ProfileHealthCheck_ProfileId",
                table: "ProfileHealthChecks",
                newName: "IX_ProfileHealthChecks_ProfileId");

            migrationBuilder.RenameIndex(
                name: "IX_ProfileHealthCheck_HealthCheckId",
                table: "ProfileHealthChecks",
                newName: "IX_ProfileHealthChecks_HealthCheckId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProfileHealthChecks",
                table: "ProfileHealthChecks",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProfileHealthChecks_HealthChecks_HealthCheckId",
                table: "ProfileHealthChecks",
                column: "HealthCheckId",
                principalTable: "HealthChecks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProfileHealthChecks_Profiles_ProfileId",
                table: "ProfileHealthChecks",
                column: "ProfileId",
                principalTable: "Profiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProfileHealthChecks_HealthChecks_HealthCheckId",
                table: "ProfileHealthChecks");

            migrationBuilder.DropForeignKey(
                name: "FK_ProfileHealthChecks_Profiles_ProfileId",
                table: "ProfileHealthChecks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProfileHealthChecks",
                table: "ProfileHealthChecks");

            migrationBuilder.RenameTable(
                name: "ProfileHealthChecks",
                newName: "ProfileHealthCheck");

            migrationBuilder.RenameIndex(
                name: "IX_ProfileHealthChecks_ProfileId",
                table: "ProfileHealthCheck",
                newName: "IX_ProfileHealthCheck_ProfileId");

            migrationBuilder.RenameIndex(
                name: "IX_ProfileHealthChecks_HealthCheckId",
                table: "ProfileHealthCheck",
                newName: "IX_ProfileHealthCheck_HealthCheckId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProfileHealthCheck",
                table: "ProfileHealthCheck",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProfileHealthCheck_HealthChecks_HealthCheckId",
                table: "ProfileHealthCheck",
                column: "HealthCheckId",
                principalTable: "HealthChecks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProfileHealthCheck_Profiles_ProfileId",
                table: "ProfileHealthCheck",
                column: "ProfileId",
                principalTable: "Profiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
