
namespace serverTCC.Models
{
    public class ContaContabil : IConta
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public decimal Valor { get; set; }
        public string UsuarioId { get; set; }
        public int MoedaId { get; set; }
        public Moeda Moeda { get; set; }
        public Usuario Usuario { get; set; }
    }
}
