using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace serverTCC.Migrations
{
    public partial class AttInvestimento : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "UltimaAtualizacao",
                table: "Investimento",
                nullable: true);

            migrationBuilder.AddColumn<List<Nullable<decimal>>>(
                name: "ValoresInseridos",
                table: "Investimento",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UltimaAtualizacao",
                table: "Investimento");

            migrationBuilder.DropColumn(
                name: "ValoresInseridos",
                table: "Investimento");
        }
    }
}
