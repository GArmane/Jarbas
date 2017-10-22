namespace serverTCC.Models
{
    public enum FaixaEtaria
    {
        
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
