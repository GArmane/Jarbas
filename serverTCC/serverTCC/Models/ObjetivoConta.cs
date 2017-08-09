namespace serverTCC.Models
{
    public class ObjetivoConta
    {
        public int Id { get; set; }
        public double Porcentagem { get; set; }
        public int ObjetivoId { get; set; }
        public int? InvestimentoId { get; set; }
        public int? ContaContabilId { get; set; }
        public Objetivo Objetivo { get; set; }
        public IConta IConta { get; set; }
    }
}
