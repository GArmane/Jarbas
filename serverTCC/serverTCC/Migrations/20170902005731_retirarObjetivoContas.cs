using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace serverTCC.Migrations
{
    public partial class retirarObjetivoContas : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ObjetivoConta");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UltimaConsulta",
                table: "Moeda",
                nullable: false,
                oldClrType: typeof(TimeSpan));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<TimeSpan>(
                name: "UltimaConsulta",
                table: "Moeda",
                nullable: false,
                oldClrType: typeof(DateTime));

            migrationBuilder.CreateTable(
                name: "ObjetivoConta",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    ContaContabilId = table.Column<int>(nullable: true),
                    InvestimentoId = table.Column<int>(nullable: true),
                    ObjetivoId = table.Column<int>(nullable: false),
                    Porcentagem = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ObjetivoConta", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ObjetivoConta_Objetivo_ObjetivoId",
                        column: x => x.ObjetivoId,
                        principalTable: "Objetivo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ObjetivoConta_ObjetivoId",
                table: "ObjetivoConta",
                column: "ObjetivoId");
        }
    }
}
