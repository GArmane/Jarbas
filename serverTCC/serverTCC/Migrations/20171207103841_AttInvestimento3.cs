using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace serverTCC.Migrations
{
    public partial class AttInvestimento3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ValoresInseridos_InvestimentoId",
                table: "ValoresInseridos");

            migrationBuilder.CreateIndex(
                name: "IX_ValoresInseridos_InvestimentoId",
                table: "ValoresInseridos",
                column: "InvestimentoId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ValoresInseridos_InvestimentoId",
                table: "ValoresInseridos");

            migrationBuilder.CreateIndex(
                name: "IX_ValoresInseridos_InvestimentoId",
                table: "ValoresInseridos",
                column: "InvestimentoId",
                unique: true);
        }
    }
}
