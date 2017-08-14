using System;

namespace serverTCC.Models
{
    public class Transferencia
    {
        public int Id { get; set; }

        public ContaContabil ContaContabilOrigem { get; set; }
        public int ContaContabilOrigemId { get; set; }

        public ContaContabil ContaContabilDestino { get;set; }
        public int ContaContabilDestinoId { get; set; }

        public decimal Valor { get; set; }
        public DateTime Data { get; set; }
        public string Descricao { get; set; }
    }
}
