using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace serverTCC.Migrations
{
    public partial class movimentacaoIdAgendamento : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Movimentacao_Agendamento_AgendamentoId",
                table: "Movimentacao");

            migrationBuilder.DropIndex(
                name: "IX_Movimentacao_AgendamentoId",
                table: "Movimentacao");

            migrationBuilder.AddColumn<int>(
                name: "MovimentacaoId",
                table: "Agendamento",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Agendamento_MovimentacaoId",
                table: "Agendamento",
                column: "MovimentacaoId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Agendamento_Movimentacao_MovimentacaoId",
                table: "Agendamento",
                column: "MovimentacaoId",
                principalTable: "Movimentacao",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Agendamento_Movimentacao_MovimentacaoId",
                table: "Agendamento");

            migrationBuilder.DropIndex(
                name: "IX_Agendamento_MovimentacaoId",
                table: "Agendamento");

            migrationBuilder.DropColumn(
                name: "MovimentacaoId",
                table: "Agendamento");

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
    }
}
