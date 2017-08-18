using Newtonsoft.Json;
using System;

namespace serverTCC.Models
{
    public class HistoricoObjetivo
    {
        public int Id { get; set; }
        public DateTime DataFinal { get; set; }
        public decimal? ValorFinal { get; set; }
        [JsonIgnore]
        public int ObjetivoId { get; set; }
        [JsonIgnore]
        public Objetivo Objetivo { get; set; }
    }
}
