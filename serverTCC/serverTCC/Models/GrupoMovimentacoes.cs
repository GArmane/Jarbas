namespace serverTCC.Models
{
    public class GrupoMovimentacoes
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string UsuarioId { get; set; }
        public Usuario Usuario { get; set; }
    }
}
