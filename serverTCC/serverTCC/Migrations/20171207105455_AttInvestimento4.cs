using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace serverTCC.Migrations
{
    public partial class AttInvestimento4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "UltimaAtualizacao",
                table: "Investimento",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "UltimaAtualizacao",
                table: "Investimento",
                nullable: true,
                oldClrType: typeof(DateTime));
        }
    }
}
