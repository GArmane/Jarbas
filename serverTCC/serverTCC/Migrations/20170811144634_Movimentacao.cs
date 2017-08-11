using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace serverTCC.Migrations
{
    public partial class Movimentacao : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Movimentacao_AspNetUsers_UsuarioId",
                table: "Movimentacao");

            migrationBuilder.DropIndex(
                name: "IX_Movimentacao_UsuarioId",
                table: "Movimentacao");

            migrationBuilder.DropColumn(
                name: "Categoria",
                table: "Movimentacao");

            migrationBuilder.DropColumn(
                name: "UsuarioId",
                table: "Movimentacao");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Categoria",
                table: "Movimentacao",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UsuarioId",
                table: "Movimentacao",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Movimentacao_UsuarioId",
                table: "Movimentacao",
                column: "UsuarioId");

            migrationBuilder.AddForeignKey(
                name: "FK_Movimentacao_AspNetUsers_UsuarioId",
                table: "Movimentacao",
                column: "UsuarioId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
