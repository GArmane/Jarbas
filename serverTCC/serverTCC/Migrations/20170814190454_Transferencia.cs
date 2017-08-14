using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;

namespace serverTCC.Migrations
{
    public partial class Transferencia : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Movimentacao_ContaContabil_ContaDestinoId",
                table: "Movimentacao");

            migrationBuilder.DropIndex(
                name: "IX_Movimentacao_ContaDestinoId",
                table: "Movimentacao");

            migrationBuilder.DropColumn(
                name: "ContaDestinoId",
                table: "Movimentacao");

            migrationBuilder.RenameColumn(
                name: "Valor",
                table: "ContaContabil",
                newName: "Saldo");

            migrationBuilder.CreateTable(
                name: "Transferencia",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    ContaContabilDestinoId = table.Column<int>(nullable: false),
                    ContaContabilOrigemId = table.Column<int>(nullable: false),
                    Data = table.Column<DateTime>(nullable: false),
                    Descricao = table.Column<string>(nullable: true),
                    Valor = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transferencia", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Transferencia_ContaContabil_ContaContabilDestinoId",
                        column: x => x.ContaContabilDestinoId,
                        principalTable: "ContaContabil",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Transferencia_ContaContabil_ContaContabilOrigemId",
                        column: x => x.ContaContabilOrigemId,
                        principalTable: "ContaContabil",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Transferencia_ContaContabilDestinoId",
                table: "Transferencia",
                column: "ContaContabilDestinoId");

            migrationBuilder.CreateIndex(
                name: "IX_Transferencia_ContaContabilOrigemId",
                table: "Transferencia",
                column: "ContaContabilOrigemId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Transferencia");

            migrationBuilder.RenameColumn(
                name: "Saldo",
                table: "ContaContabil",
                newName: "Valor");

            migrationBuilder.AddColumn<int>(
                name: "ContaDestinoId",
                table: "Movimentacao",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Movimentacao_ContaDestinoId",
                table: "Movimentacao",
                column: "ContaDestinoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Movimentacao_ContaContabil_ContaDestinoId",
                table: "Movimentacao",
                column: "ContaDestinoId",
                principalTable: "ContaContabil",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
