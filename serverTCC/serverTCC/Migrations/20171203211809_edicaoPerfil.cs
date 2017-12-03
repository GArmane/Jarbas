using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using serverTCC.Models;

namespace serverTCC.Migrations
{
    public partial class edicaoPerfil : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Escolaridade",
                table: "Perfil",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Filhos",
                table: "Perfil",
                nullable: true);

            migrationBuilder.AddColumn<List<Nullable<TipoGastos>>>(
                name: "TipoGastos",
                table: "Perfil",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Escolaridade",
                table: "Perfil");

            migrationBuilder.DropColumn(
                name: "Filhos",
                table: "Perfil");

            migrationBuilder.DropColumn(
                name: "TipoGastos",
                table: "Perfil");
        }
    }
}
