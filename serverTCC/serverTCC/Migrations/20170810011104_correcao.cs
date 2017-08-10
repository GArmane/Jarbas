using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace serverTCC.Migrations
{
    public partial class correcao : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Movimentacao_ContaContabil_ContaDestinoId",
                table: "Movimentacao");

            migrationBuilder.DropForeignKey(
                name: "FK_Movimentacao_Moeda_MoedaId",
                table: "Movimentacao");

            migrationBuilder.DropIndex(
                name: "IX_Movimentacao_MoedaId",
                table: "Movimentacao");

            migrationBuilder.DropColumn(
                name: "MoedaId",
                table: "Movimentacao");

            migrationBuilder.AlterColumn<int>(
                name: "ContaDestinoId",
                table: "Movimentacao",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_Movimentacao_ContaContabil_ContaDestinoId",
                table: "Movimentacao",
                column: "ContaDestinoId",
                principalTable: "ContaContabil",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Movimentacao_ContaContabil_ContaDestinoId",
                table: "Movimentacao");

            migrationBuilder.AlterColumn<int>(
                name: "ContaDestinoId",
                table: "Movimentacao",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MoedaId",
                table: "Movimentacao",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Movimentacao_MoedaId",
                table: "Movimentacao",
                column: "MoedaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Movimentacao_ContaContabil_ContaDestinoId",
                table: "Movimentacao",
                column: "ContaDestinoId",
                principalTable: "ContaContabil",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Movimentacao_Moeda_MoedaId",
                table: "Movimentacao",
                column: "MoedaId",
                principalTable: "Moeda",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
