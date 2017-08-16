namespace serverTCC.Models
{
    public class RecuperacaoSenha
    {
        public int Id { get; set; }

        public string UsuarioId { get; set; }
        public Usuario Usuario { get; set; }

        public string Codigo { get; set; }
    }
}
