using System;

namespace serverTCC.Models
{
    public class Transferencia
    {
        public int Id { get; set; }

        public int ReceitaId { get; set; }
        public Movimentacao Receita { get; set; }

        public int DespesaId { get; set; }
        public Movimentacao Despesa { get; set; }
    }
}
