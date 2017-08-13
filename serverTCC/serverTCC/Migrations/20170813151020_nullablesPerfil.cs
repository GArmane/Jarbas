using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace serverTCC.Migrations
{
    public partial class nullablesPerfil : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Profissao",
                table: "Perfil",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<int>(
                name: "FaixaEtaria",
                table: "Perfil",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<int>(
                name: "EscalaTempo",
                table: "Perfil",
                nullable: true,
                oldClrType: typeof(int));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Profissao",
                table: "Perfil",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "FaixaEtaria",
                table: "Perfil",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "EscalaTempo",
                table: "Perfil",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);
        }
    }
}
