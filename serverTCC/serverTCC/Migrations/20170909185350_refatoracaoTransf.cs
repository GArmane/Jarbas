using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace serverTCC.Migrations
{
    public partial class refatoracaoTransf : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transferencia_ContaContabil_ContaContabilDestinoId",
                table: "Transferencia");

            migrationBuilder.DropForeignKey(
                name: "FK_Transferencia_ContaContabil_ContaContabilOrigemId",
                table: "Transferencia");

            migrationBuilder.DropColumn(
                name: "Data",
                table: "Transferencia");

            migrationBuilder.DropColumn(
                name: "Descricao",
                table: "Transferencia");

            migrationBuilder.DropColumn(
                name: "Valor",
                table: "Transferencia");

            migrationBuilder.RenameColumn(
                name: "ContaContabilOrigemId",
                table: "Transferencia",
                newName: "ReceitaId");

            migrationBuilder.RenameColumn(
                name: "ContaContabilDestinoId",
                table: "Transferencia",
                newName: "DespesaId");

            migrationBuilder.RenameIndex(
                name: "IX_Transferencia_ContaContabilOrigemId",
                table: "Transferencia",
                newName: "IX_Transferencia_ReceitaId");

            migrationBuilder.RenameIndex(
                name: "IX_Transferencia_ContaContabilDestinoId",
                table: "Transferencia",
                newName: "IX_Transferencia_DespesaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Transferencia_Movimentacao_DespesaId",
                table: "Transferencia",
                column: "DespesaId",
                principalTable: "Movimentacao",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Transferencia_Movimentacao_ReceitaId",
                table: "Transferencia",
                column: "ReceitaId",
                principalTable: "Movimentacao",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transferencia_Movimentacao_DespesaId",
                table: "Transferencia");

            migrationBuilder.DropForeignKey(
                name: "FK_Transferencia_Movimentacao_ReceitaId",
                table: "Transferencia");

            migrationBuilder.RenameColumn(
                name: "ReceitaId",
                table: "Transferencia",
                newName: "ContaContabilOrigemId");

            migrationBuilder.RenameColumn(
                name: "DespesaId",
                table: "Transferencia",
                newName: "ContaContabilDestinoId");

            migrationBuilder.RenameIndex(
                name: "IX_Transferencia_ReceitaId",
                table: "Transferencia",
                newName: "IX_Transferencia_ContaContabilOrigemId");

            migrationBuilder.RenameIndex(
                name: "IX_Transferencia_DespesaId",
                table: "Transferencia",
                newName: "IX_Transferencia_ContaContabilDestinoId");

            migrationBuilder.AddColumn<DateTime>(
                name: "Data",
                table: "Transferencia",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Descricao",
                table: "Transferencia",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Valor",
                table: "Transferencia",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddForeignKey(
                name: "FK_Transferencia_ContaContabil_ContaContabilDestinoId",
                table: "Transferencia",
                column: "ContaContabilDestinoId",
                principalTable: "ContaContabil",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Transferencia_ContaContabil_ContaContabilOrigemId",
                table: "Transferencia",
                column: "ContaContabilOrigemId",
                principalTable: "ContaContabil",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
