namespace serverTCC.Models
{
    public enum FaixaEtaria
    {
        ate16,
        ate25,
        ate40,
        ate64,
        mais65
    }
    
    public class Perfil
    {
        public int Id { get; set; }

        public Moeda Moeda { get; set; }
        public int? MoedaId { get; set; }

        public decimal? Valor { get; set; }
        public bool RendaFixa { get; set; }

        public Profissao? Profissao { get; set; }
        public FaixaEtaria? FaixaEtaria { get; set; }
        public EscalaTempo? EscalaTempo { get; set; }
    }
}
