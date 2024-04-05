using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace core.Migrations
{
    /// <inheritdoc />
    public partial class title : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MeetingOccasions_Meetings_MeetingId",
                table: "MeetingOccasions");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingOccasions_Profiles_ProfileId",
                table: "MeetingOccasions");

            migrationBuilder.AlterColumn<string>(
                name: "ProfileId",
                table: "UpdateComments",
                type: "varchar(255)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "ProjectUpdates",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "MeetingOccasions",
                keyColumn: "ProfileId",
                keyValue: null,
                column: "ProfileId",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "ProfileId",
                table: "MeetingOccasions",
                type: "varchar(255)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "MeetingOccasions",
                keyColumn: "MeetingId",
                keyValue: null,
                column: "MeetingId",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "MeetingId",
                table: "MeetingOccasions",
                type: "varchar(255)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_UpdateComments_ProfileId",
                table: "UpdateComments",
                column: "ProfileId");

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingOccasions_Meetings_MeetingId",
                table: "MeetingOccasions",
                column: "MeetingId",
                principalTable: "Meetings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingOccasions_Profiles_ProfileId",
                table: "MeetingOccasions",
                column: "ProfileId",
                principalTable: "Profiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UpdateComments_Profiles_ProfileId",
                table: "UpdateComments",
                column: "ProfileId",
                principalTable: "Profiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MeetingOccasions_Meetings_MeetingId",
                table: "MeetingOccasions");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingOccasions_Profiles_ProfileId",
                table: "MeetingOccasions");

            migrationBuilder.DropForeignKey(
                name: "FK_UpdateComments_Profiles_ProfileId",
                table: "UpdateComments");

            migrationBuilder.DropIndex(
                name: "IX_UpdateComments_ProfileId",
                table: "UpdateComments");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "ProjectUpdates");

            migrationBuilder.AlterColumn<string>(
                name: "ProfileId",
                table: "UpdateComments",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "ProfileId",
                table: "MeetingOccasions",
                type: "varchar(255)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "MeetingId",
                table: "MeetingOccasions",
                type: "varchar(255)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingOccasions_Meetings_MeetingId",
                table: "MeetingOccasions",
                column: "MeetingId",
                principalTable: "Meetings",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingOccasions_Profiles_ProfileId",
                table: "MeetingOccasions",
                column: "ProfileId",
                principalTable: "Profiles",
                principalColumn: "Id");
        }
    }
}
