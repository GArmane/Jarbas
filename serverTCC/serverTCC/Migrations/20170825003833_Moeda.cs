using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace serverTCC.Migrations
{
    public partial class Moeda : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Fonte",
                table: "Moeda",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UltimaConsulta",
                table: "Moeda",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Fonte",
                table: "Moeda");

            migrationBuilder.DropColumn(
                name: "UltimaConsulta",
                table: "Moeda");
        }
    }
}
