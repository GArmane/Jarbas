using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using serverTCC.Models;

namespace serverTCC.Migrations
{
    public partial class retiradaTiposGastos : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TipoGastos",
                table: "Perfil");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<TipoGastos[]>(
                name: "TipoGastos",
                table: "Perfil",
                nullable: true);
        }
    }
}
