using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace serverTCC.Models
{
    public class ObjetivoConta
    {
        public int Id { get; set; }

        [NotMapped]
        public IConta IConta { get; set; }
        public int? ContaContabilId { get; set; }

        public int? InvestimentoId { get; set; }
        [JsonIgnore]
        public int ObjetivoId { get; set; }
        [JsonIgnore]
        public Objetivo Objetivo { get; set; }
        
        public double Porcentagem { get; set; }
    }
}
