using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using serverTCC.Data;
using serverTCC.Models;

namespace serverTCC.Migrations
{
    [DbContext(typeof(JarbasContext))]
    [Migration("20171203213935_edicaoPerfilArray")]
    partial class edicaoPerfilArray
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
                .HasAnnotation("ProductVersion", "1.1.2");

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Name")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasName("RoleNameIndex");

                    b.ToTable("AspNetRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("RoleId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider");

                    b.Property<string>("ProviderKey");

                    b.Property<string>("ProviderDisplayName");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("RoleId");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("LoginProvider");

                    b.Property<string>("Name");

                    b.Property<string>("Value");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens");
                });

            modelBuilder.Entity("serverTCC.Models.Agendamento", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("DataLimite");

                    b.Property<int?>("DiaMes");

                    b.Property<int?>("DiaSemana");

                    b.Property<DiaSemana?[]>("DiasSemana");

                    b.Property<int>("EscalaTempo");

                    b.Property<int>("MovimentacaoId");

                    b.Property<int>("QtdTempo");

                    b.Property<int?>("SemanaMes");

                    b.Property<int?>("VezesLimite");

                    b.HasKey("Id");

                    b.HasIndex("MovimentacaoId")
                        .IsUnique();

                    b.ToTable("Agendamento");
                });

            modelBuilder.Entity("serverTCC.Models.Configuracoes", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("Idioma");

                    b.Property<string>("UsuarioId");

                    b.HasKey("Id");

                    b.HasIndex("UsuarioId");

                    b.ToTable("Configuracoes");
                });

            modelBuilder.Entity("serverTCC.Models.ContaContabil", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("MoedaId");

                    b.Property<string>("Nome");

                    b.Property<decimal>("Saldo");

                    b.Property<string>("UsuarioId");

                    b.HasKey("Id");

                    b.HasIndex("MoedaId");

                    b.HasIndex("UsuarioId");

                    b.ToTable("ContaContabil");
                });

            modelBuilder.Entity("serverTCC.Models.GrupoMovimentacoes", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Nome");

                    b.Property<string>("UsuarioId");

                    b.HasKey("Id");

                    b.HasIndex("UsuarioId");

                    b.ToTable("GrupoMovimentacoes");
                });

            modelBuilder.Entity("serverTCC.Models.HistoricoObjetivo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("DataFinal");

                    b.Property<int>("ObjetivoId");

                    b.Property<decimal?>("ValorFinal");

                    b.HasKey("Id");

                    b.HasIndex("ObjetivoId");

                    b.ToTable("HistoricoObjetivo");
                });

            modelBuilder.Entity("serverTCC.Models.Investimento", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("DataInicio");

                    b.Property<string>("Descricao");

                    b.Property<int>("EscalaTempo");

                    b.Property<int>("MoedaId");

                    b.Property<int>("QtdTempo");

                    b.Property<int>("TipoInvestimentoId");

                    b.Property<string>("UsuarioId");

                    b.Property<decimal>("ValorAtual");

                    b.Property<decimal>("ValorInvestido");

                    b.HasKey("Id");

                    b.HasIndex("MoedaId");

                    b.HasIndex("TipoInvestimentoId");

                    b.HasIndex("UsuarioId");

                    b.ToTable("Investimento");
                });

            modelBuilder.Entity("serverTCC.Models.Moeda", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<decimal>("CotacaoComercial");

                    b.Property<string>("Fonte");

                    b.Property<string>("Nome");

                    b.Property<string>("Simbolo");

                    b.Property<DateTime>("UltimaConsulta");

                    b.HasKey("Id");

                    b.ToTable("Moeda");
                });

            modelBuilder.Entity("serverTCC.Models.Movimentacao", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("AgendamentoId");

                    b.Property<int>("ContaContabilId");

                    b.Property<DateTime>("Data");

                    b.Property<string>("Descricao");

                    b.Property<int>("GrupoMovimentacoesId");

                    b.Property<int>("TipoMovimentacao");

                    b.Property<decimal>("Valor");

                    b.HasKey("Id");

                    b.HasIndex("ContaContabilId");

                    b.HasIndex("GrupoMovimentacoesId");

                    b.ToTable("Movimentacao");
                });

            modelBuilder.Entity("serverTCC.Models.Objetivo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("Arquivar")
                        .ValueGeneratedOnAdd()
                        .HasDefaultValue(false);

                    b.Property<DateTime>("DataInicial");

                    b.Property<string>("Descricao");

                    b.Property<int>("MoedaId");

                    b.Property<string>("UsuarioId");

                    b.Property<decimal>("Valor");

                    b.HasKey("Id");

                    b.HasIndex("MoedaId");

                    b.HasIndex("UsuarioId");

                    b.ToTable("Objetivo");
                });

            modelBuilder.Entity("serverTCC.Models.Perfil", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("EscalaTempo");

                    b.Property<int?>("Escolaridade");

                    b.Property<int?>("FaixaEtaria");

                    b.Property<bool?>("Filhos");

                    b.Property<int?>("MoedaId");

                    b.Property<int?>("Profissao");

                    b.Property<bool>("RendaFixa");

                    b.Property<TipoGastos[]>("TipoGastos");

                    b.Property<decimal?>("Valor");

                    b.HasKey("Id");

                    b.HasIndex("MoedaId");

                    b.ToTable("Perfil");
                });

            modelBuilder.Entity("serverTCC.Models.RecuperacaoSenha", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Codigo");

                    b.Property<string>("UsuarioId");

                    b.HasKey("Id");

                    b.HasIndex("UsuarioId");

                    b.ToTable("RecuperacaoSenha");
                });

            modelBuilder.Entity("serverTCC.Models.TipoInvestimento", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Nome");

                    b.Property<double>("Taxa");

                    b.HasKey("Id");

                    b.ToTable("TipoInvestimento");
                });

            modelBuilder.Entity("serverTCC.Models.Transferencia", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("DespesaId");

                    b.Property<int>("ReceitaId");

                    b.HasKey("Id");

                    b.HasIndex("DespesaId");

                    b.HasIndex("ReceitaId");

                    b.ToTable("Transferencia");
                });

            modelBuilder.Entity("serverTCC.Models.Usuario", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("AccessFailedCount");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Email")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailConfirmed");

                    b.Property<bool>("LockoutEnabled");

                    b.Property<DateTimeOffset?>("LockoutEnd");

                    b.Property<string>("Nome");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256);

                    b.Property<string>("PasswordHash");

                    b.Property<int?>("PerfilId");

                    b.Property<string>("PhoneNumber");

                    b.Property<bool>("PhoneNumberConfirmed");

                    b.Property<string>("SecurityStamp");

                    b.Property<bool>("TwoFactorEnabled");

                    b.Property<string>("UserName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex");

                    b.HasIndex("PerfilId");

                    b.ToTable("AspNetUsers");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRole")
                        .WithMany("Claims")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("serverTCC.Models.Usuario")
                        .WithMany("Claims")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("serverTCC.Models.Usuario")
                        .WithMany("Logins")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRole")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("serverTCC.Models.Usuario")
                        .WithMany("Roles")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("serverTCC.Models.Agendamento", b =>
                {
                    b.HasOne("serverTCC.Models.Movimentacao", "Movimentacao")
                        .WithOne("Agendamento")
                        .HasForeignKey("serverTCC.Models.Agendamento", "MovimentacaoId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("serverTCC.Models.Configuracoes", b =>
                {
                    b.HasOne("serverTCC.Models.Usuario", "Usuario")
                        .WithMany()
                        .HasForeignKey("UsuarioId");
                });

            modelBuilder.Entity("serverTCC.Models.ContaContabil", b =>
                {
                    b.HasOne("serverTCC.Models.Moeda", "Moeda")
                        .WithMany()
                        .HasForeignKey("MoedaId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("serverTCC.Models.Usuario", "Usuario")
                        .WithMany()
                        .HasForeignKey("UsuarioId");
                });

            modelBuilder.Entity("serverTCC.Models.GrupoMovimentacoes", b =>
                {
                    b.HasOne("serverTCC.Models.Usuario", "Usuario")
                        .WithMany()
                        .HasForeignKey("UsuarioId");
                });

            modelBuilder.Entity("serverTCC.Models.HistoricoObjetivo", b =>
                {
                    b.HasOne("serverTCC.Models.Objetivo", "Objetivo")
                        .WithMany("HistoricoObjetivo")
                        .HasForeignKey("ObjetivoId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("serverTCC.Models.Investimento", b =>
                {
                    b.HasOne("serverTCC.Models.Moeda", "Moeda")
                        .WithMany()
                        .HasForeignKey("MoedaId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("serverTCC.Models.TipoInvestimento", "TipoInvestimento")
                        .WithMany()
                        .HasForeignKey("TipoInvestimentoId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("serverTCC.Models.Usuario", "Usuario")
                        .WithMany()
                        .HasForeignKey("UsuarioId");
                });

            modelBuilder.Entity("serverTCC.Models.Movimentacao", b =>
                {
                    b.HasOne("serverTCC.Models.ContaContabil", "ContaContabil")
                        .WithMany()
                        .HasForeignKey("ContaContabilId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("serverTCC.Models.GrupoMovimentacoes", "GrupoMovimentacoes")
                        .WithMany()
                        .HasForeignKey("GrupoMovimentacoesId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("serverTCC.Models.Objetivo", b =>
                {
                    b.HasOne("serverTCC.Models.Moeda", "Moeda")
                        .WithMany()
                        .HasForeignKey("MoedaId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("serverTCC.Models.Usuario", "Usuario")
                        .WithMany()
                        .HasForeignKey("UsuarioId");
                });

            modelBuilder.Entity("serverTCC.Models.Perfil", b =>
                {
                    b.HasOne("serverTCC.Models.Moeda", "Moeda")
                        .WithMany()
                        .HasForeignKey("MoedaId");
                });

            modelBuilder.Entity("serverTCC.Models.RecuperacaoSenha", b =>
                {
                    b.HasOne("serverTCC.Models.Usuario", "Usuario")
                        .WithMany()
                        .HasForeignKey("UsuarioId");
                });

            modelBuilder.Entity("serverTCC.Models.Transferencia", b =>
                {
                    b.HasOne("serverTCC.Models.Movimentacao", "Despesa")
                        .WithMany()
                        .HasForeignKey("DespesaId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("serverTCC.Models.Movimentacao", "Receita")
                        .WithMany()
                        .HasForeignKey("ReceitaId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("serverTCC.Models.Usuario", b =>
                {
                    b.HasOne("serverTCC.Models.Perfil", "Perfil")
                        .WithMany()
                        .HasForeignKey("PerfilId");
                });
        }
    }
}
