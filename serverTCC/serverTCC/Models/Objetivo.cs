
using System;
using System.Collections.Generic;

namespace serverTCC.Models
{
    public class Objetivo
    {
        public int Id { get; set; }
        public decimal Valor { get; set; }
        public DateTime DataInicial { get; set; }
        public IEnumerable<ObjetivoConta> ObjetivosConta { get; set; }
        public string Descricao { get; set; }
        public IEnumerable<HistoricoObjetivo> HistoricoObjetivo { get; set; }
        public string UsuarioId { get; set; }
        public Usuario Usuario { get; set; }
    }
}
