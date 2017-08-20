using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace serverTCC.Migrations
{
    public partial class moedaObjetivo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MoedaId",
                table: "Objetivo",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Objetivo_MoedaId",
                table: "Objetivo",
                column: "MoedaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Objetivo_Moeda_MoedaId",
                table: "Objetivo",
                column: "MoedaId",
                principalTable: "Moeda",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Objetivo_Moeda_MoedaId",
                table: "Objetivo");

            migrationBuilder.DropIndex(
                name: "IX_Objetivo_MoedaId",
                table: "Objetivo");

            migrationBuilder.DropColumn(
                name: "MoedaId",
                table: "Objetivo");
        }
    }
}
