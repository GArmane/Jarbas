using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;
using serverTCC.Models;

namespace serverTCC.Migrations
{
    public partial class Agendamento : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EscalaTempo",
                table: "Movimentacao");

            migrationBuilder.DropColumn(
                name: "QtdTempo",
                table: "Movimentacao");

            migrationBuilder.AddColumn<int>(
                name: "AgendamentoId",
                table: "Movimentacao",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Agendamento",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    DataLimite = table.Column<DateTime>(nullable: true),
                    DiaMes = table.Column<int>(nullable: true),
                    DiaSemana = table.Column<int>(nullable: true),
                    DiasSemana = table.Column<DiaSemana?[]>(nullable: true),
                    EscalaTempo = table.Column<int>(nullable: false),
                    QtdTempo = table.Column<int>(nullable: false),
                    SemanaMes = table.Column<int>(nullable: true),
                    VezesLimite = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Agendamento", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Movimentacao_AgendamentoId",
                table: "Movimentacao",
                column: "AgendamentoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Movimentacao_Agendamento_AgendamentoId",
                table: "Movimentacao",
                column: "AgendamentoId",
                principalTable: "Agendamento",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Movimentacao_Agendamento_AgendamentoId",
                table: "Movimentacao");

            migrationBuilder.DropTable(
                name: "Agendamento");

            migrationBuilder.DropIndex(
                name: "IX_Movimentacao_AgendamentoId",
                table: "Movimentacao");

            migrationBuilder.DropColumn(
                name: "AgendamentoId",
                table: "Movimentacao");

            migrationBuilder.AddColumn<int>(
                name: "EscalaTempo",
                table: "Movimentacao",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "QtdTempo",
                table: "Movimentacao",
                nullable: false,
                defaultValue: 0);
        }
    }
}
