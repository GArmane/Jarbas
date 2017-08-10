using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace serverTCC.Migrations
{
    public partial class perfilIDNullable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Perfil_PerfilId",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<int>(
                name: "PerfilId",
                table: "AspNetUsers",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Perfil_PerfilId",
                table: "AspNetUsers",
                column: "PerfilId",
                principalTable: "Perfil",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Perfil_PerfilId",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<int>(
                name: "PerfilId",
                table: "AspNetUsers",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Perfil_PerfilId",
                table: "AspNetUsers",
                column: "PerfilId",
                principalTable: "Perfil",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
