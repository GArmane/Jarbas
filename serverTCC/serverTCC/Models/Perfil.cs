namespace serverTCC.Models
{
    public enum Profissao
    {

    }

    public enum FaixaEtaria
    {

    }
    
    public class Perfil
    {
        public int Id { get; set; }
        public decimal Valor { get; set; }
        public int MoedaId { get; set; }
        public bool RendaFixa { get; set; }
        public Profissao Profissao { get; set; }
        public FaixaEtaria FaixaEtaria { get; set; }
        public EscalaTempo EscalaTempo { get; set; }
        public Moeda Moeda { get; set; }
    }
}
