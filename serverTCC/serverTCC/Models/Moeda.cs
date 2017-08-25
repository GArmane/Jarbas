using System;

namespace serverTCC.Models
{
    public class Moeda
    {
        public int Id { get; set; }
        public string Simbolo { get; set; }
        public string Nome { get; set; }
        public decimal CotacaoComercial { get; set; }
        public DateTime UltimaConsulta {get; set; }
        public string Fonte {get; set; }
    }
}
