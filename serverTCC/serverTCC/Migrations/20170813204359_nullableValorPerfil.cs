using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace serverTCC.Migrations
{
    public partial class nullableValorPerfil : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Perfil_Moeda_MoedaId",
                table: "Perfil");

            migrationBuilder.AlterColumn<decimal>(
                name: "Valor",
                table: "Perfil",
                nullable: true,
                oldClrType: typeof(decimal));

            migrationBuilder.AlterColumn<int>(
                name: "MoedaId",
                table: "Perfil",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_Perfil_Moeda_MoedaId",
                table: "Perfil",
                column: "MoedaId",
                principalTable: "Moeda",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Perfil_Moeda_MoedaId",
                table: "Perfil");

            migrationBuilder.AlterColumn<decimal>(
                name: "Valor",
                table: "Perfil",
                nullable: false,
                oldClrType: typeof(decimal),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "MoedaId",
                table: "Perfil",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Perfil_Moeda_MoedaId",
                table: "Perfil",
                column: "MoedaId",
                principalTable: "Moeda",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
