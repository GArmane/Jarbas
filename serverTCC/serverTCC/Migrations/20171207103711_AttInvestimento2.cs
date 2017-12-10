using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace serverTCC.Migrations
{
    public partial class AttInvestimento2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ValoresInseridos",
                table: "Investimento");

            migrationBuilder.CreateTable(
                name: "ValoresInseridos",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Data = table.Column<DateTime>(nullable: false),
                    InvestimentoId = table.Column<int>(nullable: false),
                    Valor = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ValoresInseridos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ValoresInseridos_Investimento_InvestimentoId",
                        column: x => x.InvestimentoId,
                        principalTable: "Investimento",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ValoresInseridos_InvestimentoId",
                table: "ValoresInseridos",
                column: "InvestimentoId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ValoresInseridos");

            migrationBuilder.AddColumn<List<Nullable<decimal>>>(
                name: "ValoresInseridos",
                table: "Investimento",
                nullable: true);
        }
    }
}
