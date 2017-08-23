using System;
using System.Collections.Generic;

namespace serverTCC.Models
{
    public enum DiaSemana
    {
        Domingo,
        Segunda,
        Terca,
        Quarta,
        Quinta,
        Sexta,
        Sabado
    }

    public class Agendamento
    {
        public int Id { get; set; }
        public EscalaTempo EscalaTempo { get; set; }
        public int QtdTempo { get; set; }

        //Até quando repete, se forem nulos, é para sempre
        public DateTime? DataLimite { get; set; } //Caso 1: Repete até uma data específica
        public int? VezesLimite { get; set; } //Caso 2: Repete por uma quantidade de vezes

        //Exclusivo de repetição semanal
        public DiaSemana?[] DiasSemana { get; set; }

        //Exclusivo de repetição mensal
        public int? DiaMes { get; set; } //Caso 1: Repete num dia específico do mes

        public int? SemanaMes { get; set; } //Caso 2: Repete num dia da semana, de uma semana especifica do mes
        public DiaSemana? DiaSemana { get; set; }

    }
}
