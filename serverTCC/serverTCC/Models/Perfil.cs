using System.Collections.Generic;

namespace serverTCC.Models
{
    public enum FaixaEtaria
    {
        ate16,
        ate25,
        ate40,
        ate64,
        mais65
    }

    public enum Escolaridade
    {
        fundIncompleto,
        fundCompleto,
        medIncompleto,
        medCompleto,
        supIncompleto,
        supCompleto,
        latoIncompleto,
        latoCompleto,
        mestIncompleto,
        mestCompleto,
        doutIncompleto,
        doutCompleto
    }

    public enum TipoGastos
    {
        alimentacao,
        transporte,
        contasServicos,
        bensDuraveis,
        supermercado,
        lazer,
        outro
    }

    public enum PagarDespesas
    {
        debito,
        dinheiro,
        credito,
        outro
    }
    
    public class Perfil
    {
        public int Id { get; set; }

        public Moeda Moeda { get; set; }
        public int? MoedaId { get; set; }

        public decimal? Valor { get; set; }
        public bool RendaFixa { get; set; }

        public Profissao? Profissao { get; set; }
        public FaixaEtaria? FaixaEtaria { get; set; }
        public EscalaTempo? EscalaTempo { get; set; }

        public Escolaridade? Escolaridade { get; set; }
        public bool? Filhos { get; set; }
    }
}
