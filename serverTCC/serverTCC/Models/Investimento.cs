using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace serverTCC.Models
{
    public class Investimento
    {
        public int Id { get; set; }

        public Usuario Usuario { get; set; }
        public string UsuarioId { get; set; }

        public TipoInvestimento TipoInvestimento { get; set; }
        public int TipoInvestimentoId { get; set; }

        public Moeda Moeda { get; set; }
        public int MoedaId { get; set; }

        public string Descricao { get; set; }
        public decimal ValorAtual { get; set; }
        public decimal ValorInvestido { get; set; }
        public int QtdTempo { get; set; }
        public DateTime DataInicio { get; set; }

        public EscalaTempo EscalaTempo { get; set; }

        [JsonIgnore]
        public DateTime UltimaAtualizacao { get; set; }
        [JsonIgnore]
        public List<ValoresInseridos> ValoresInseridos { get; set; }
    }

    public class ValoresInseridos
    {
        public int Id { get; set; }
        public int InvestimentoId { get; set; }
        public Investimento Investimento { get; set; }
        public DateTime Data { get; set; }
        public decimal Valor { get; set; }
    }
}
