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
            migrationBuilder
                .CreateTable(
                    name: "Todos",
                    columns: table =>
                        new
                        {
                            Id = table
                                .Column<string>(type: "varchar(255)", nullable: false)
                                .Annotation("MySql:CharSet", "utf8mb4"),
                            Description = table
                                .Column<string>(type: "longtext", nullable: true)
                                .Annotation("MySql:CharSet", "utf8mb4"),
                            Title = table
                                .Column<string>(type: "longtext", nullable: false)
                                .Annotation("MySql:CharSet", "utf8mb4"),
                            Date = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                            TeamId = table
                                .Column<string>(type: "varchar(255)", nullable: true)
                                .Annotation("MySql:CharSet", "utf8mb4")
                        },
                    constraints: table =>
                    {
                        table.PrimaryKey("PK_Todos", x => x.Id);
                        table.ForeignKey(
                            name: "FK_Todos_Teams_TeamId",
                            column: x => x.TeamId,
                            principalTable: "Teams",
                            principalColumn: "Id"
                        );
                    }
                )
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(name: "IX_Todos_TeamId", table: "Todos", column: "TeamId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "Todos");
        }
    }
}
