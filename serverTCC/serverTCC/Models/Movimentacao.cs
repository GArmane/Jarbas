using Newtonsoft.Json;
using System;

namespace serverTCC.Models
{
    public enum TipoMovimentacao
    {
        Receita,
        Despesa,
    }

    public class Movimentacao
    {
        public int Id { get; set; }

        [JsonIgnore]
        public ContaContabil ContaContabil { get; set; }
        public int ContaContabilId { get; set; }

        public GrupoMovimentacoes GrupoMovimentacoes { get; set; }
        public int GrupoMovimentacoesId { get; set; }

        public decimal Valor { get; set; }
        public string Descricao { get; set; }

        public int? AgendamentoId { get; set; }
        public Agendamento Agendamento { get; set; }

        public DateTime Data { get; set; }
        public TipoMovimentacao TipoMovimentacao { get; set; }
    }
}
