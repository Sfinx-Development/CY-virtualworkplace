using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace core.Migrations
{
    /// <inheritdoc />
    public partial class nullablecps : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_ConversationParticipants_ConversationParticipantId",
                table: "Messages");

            migrationBuilder.AlterColumn<string>(
                name: "ConversationParticipantId",
                table: "Messages",
                type: "varchar(255)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_ConversationParticipants_ConversationParticipantId",
                table: "Messages",
                column: "ConversationParticipantId",
                principalTable: "ConversationParticipants",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_ConversationParticipants_ConversationParticipantId",
                table: "Messages");

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "ConversationParticipantId",
                keyValue: null,
                column: "ConversationParticipantId",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "ConversationParticipantId",
                table: "Messages",
                type: "varchar(255)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_ConversationParticipants_ConversationParticipantId",
                table: "Messages",
                column: "ConversationParticipantId",
                principalTable: "ConversationParticipants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
