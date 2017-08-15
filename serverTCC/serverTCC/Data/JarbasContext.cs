using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using serverTCC.Models;

namespace serverTCC.Data
{
    public class JarbasContext : IdentityDbContext<Usuario>
    {
        //O DbContext precisa de uma instancia de DbContextOptions para executar
        public JarbasContext(DbContextOptions<JarbasContext> options) : base(options) { }

        //Lista de entidades para o BD
        public DbSet<Configuracoes> Configuracoes { get; set; }
        public DbSet<ContaContabil> ContaContabil { get; set; }
        public DbSet<GrupoMovimentacoes> GrupoMovimentacoes { get; set; }
        public DbSet<HistoricoObjetivo> HistoricoObjetivo { get; set; }
        public DbSet<Investimento> Investimento { get; set; }
        public DbSet<Moeda> Moeda { get; set; }
        public DbSet<Movimentacao> Movimentacao { get; set; }
        public DbSet<Transferencia> Transferencia { get; set; }
        public DbSet<Objetivo> Objetivo { get; set; }
        public DbSet<ObjetivoConta> ObjetivoConta { get; set; }
        public DbSet<Perfil> Perfil { get; set; }
        public DbSet<TipoInvestimento> TipoInvestimento { get; set; }
        public DbSet<Usuario> Usuario { get; set; }
        public DbSet<RecuperacaoSenha> RecuperacaoSenha { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Ignore<UsuarioModel>();
            
            base.OnModelCreating(builder);
        }
    }
}
