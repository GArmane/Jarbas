namespace serverTCC.Models
{
    public enum Idioma
    {
        Portugues,
        Ingles
    }

    public class Configuracoes
    {
        public int Id { get; set; }
        public string UsuarioId { get; set; }
        public Idioma Idioma { get; set; }
        public Usuario Usuario { get; set; }
    }
}
