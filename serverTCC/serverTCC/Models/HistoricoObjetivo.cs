using System;

namespace serverTCC.Models
{
    public class HistoricoObjetivo
    {
        public int Id { get; set; }
        public DateTime DataFinal { get; set; }
        public decimal ValorFinal { get; set; }
        public int ObjetivoId { get; set; }
        public Objetivo Objetivo { get; set; }
    }
}
