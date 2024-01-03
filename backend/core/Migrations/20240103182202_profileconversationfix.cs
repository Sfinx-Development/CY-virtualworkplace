using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace core.Migrations
{
    /// <inheritdoc />
    public partial class profileconversationfix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Conversations_Users_CreatorId",
                table: "Conversations");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Users_SenderId",
                table: "Messages");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Conversations_ConversationId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_ConversationId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ConversationId",
                table: "Users");

            migrationBuilder.AddColumn<int>(
                name: "ConversationId",
                table: "Profile",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Conversations",
                keyColumn: "CreatorId",
                keyValue: null,
                column: "CreatorId",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "CreatorId",
                table: "Conversations",
                type: "varchar(255)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Profile_ConversationId",
                table: "Profile",
                column: "ConversationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Conversations_Profile_CreatorId",
                table: "Conversations",
                column: "CreatorId",
                principalTable: "Profile",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Profile_SenderId",
                table: "Messages",
                column: "SenderId",
                principalTable: "Profile",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Profile_Conversations_ConversationId",
                table: "Profile",
                column: "ConversationId",
                principalTable: "Conversations",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Conversations_Profile_CreatorId",
                table: "Conversations");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Profile_SenderId",
                table: "Messages");

            migrationBuilder.DropForeignKey(
                name: "FK_Profile_Conversations_ConversationId",
                table: "Profile");

            migrationBuilder.DropIndex(
                name: "IX_Profile_ConversationId",
                table: "Profile");

            migrationBuilder.DropColumn(
                name: "ConversationId",
                table: "Profile");

            migrationBuilder.AddColumn<int>(
                name: "ConversationId",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatorId",
                table: "Conversations",
                type: "varchar(255)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Users_ConversationId",
                table: "Users",
                column: "ConversationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Conversations_Users_CreatorId",
                table: "Conversations",
                column: "CreatorId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Users_SenderId",
                table: "Messages",
                column: "SenderId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Conversations_ConversationId",
                table: "Users",
                column: "ConversationId",
                principalTable: "Conversations",
                principalColumn: "Id");
        }
    }
}
