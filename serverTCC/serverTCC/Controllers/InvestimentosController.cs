using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using serverTCC.Data;
using serverTCC.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace serverTCC.Controllers
{
    [Produces("application/json")]
    [Route("api/Investimentos")]
    //[Authorize]
    public class InvestimentosController : Controller
    {
        private JarbasContext context;

        public InvestimentosController(JarbasContext ctx)
        {
            context = ctx;
        }

        /// <summary>
        /// Cria um novo investimento
        /// POST api/Investimentos
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Investimento investimento)
        {
            try
            {
                bool usuarioExists = await context.Usuario.AnyAsync(u => u.Id.Equals(investimento.UsuarioId));

                if (usuarioExists)
                {
                    context.Investimento.Add(investimento);
                    await context.SaveChangesAsync();
                    return CreatedAtAction("Create", investimento);
                }
                else
                {
                    ModelState.AddModelError("Usuario", "Usuário não cadastrado no sistema.");
                    return NotFound(ModelState.Values.SelectMany(e => e.Errors));
                }
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Busca todas os investimentos do usuário
        /// GET api/Investimentos/Usuario/userId
        /// </summary>
        [HttpGet("Usuario/{userId}")]
        public async Task<IActionResult> GetUser([FromRoute] string userId)
        {
            try
            {
                var investimentos = context.Investimento
                    .Include(i => i.Moeda)
                    .Include(i => i.TipoInvestimento)
                    .Where(i => i.UsuarioId.Equals(userId));

                foreach(var investimento in investimentos)
                {
                    investimento.ValorAtual = AtualizarValor(investimento, DateTime.Now);
                }

                context.Investimento.UpdateRange(investimentos);

                await context.SaveChangesAsync();

                return Ok(investimentos);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message); 
            }
        }

        /// <summary>
        /// Busca um investimento especifico
        /// GET api/Investimentos/id
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] int id)
        {
            try
            {
                var investimento = await context.Investimento
                    .Include(i => i.Moeda)
                    .Include(i => i.TipoInvestimento)
                    .FirstOrDefaultAsync(i => i.Id.Equals(id));


                if(investimento != null)
                {
                    investimento.ValorAtual = AtualizarValor(investimento, DateTime.Now);
                    context.Investimento.Update(investimento);              
                    await context.SaveChangesAsync();
                    return Ok(investimento);
                }
                else
                {
                    ModelState.AddModelError("Investimento", "Investimento não encontrado");
                    return NotFound(ModelState.Values.SelectMany(v => v.Errors));
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Edita um investimento existente
        /// PUT api/Investimentos/ID
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Edit([FromRoute] int id, [FromBody] Investimento investimento)
        {
            try
            {
                var investimentoExists = await context.Investimento.AnyAsync(i => i.Id.Equals(id));

                if (investimentoExists)
                {
                    context.Investimento.Update(investimento);

                    await context.SaveChangesAsync();

                    return Ok(investimento);
                }
                else
                {
                    ModelState.AddModelError("Investimento", "Investimento não encontrado");
                    return NotFound(ModelState.Values.SelectMany(v => v.Errors));
                }
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Deleta um investimento existente
        /// DELETE api/Investimentos/ID
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            try
            {
                var investimento = await context.Investimento.FirstOrDefaultAsync(i => i.Id.Equals(id));

                if(investimento != null)
                {
                    context.Investimento.Remove(investimento);

                    await context.SaveChangesAsync();

                    return Ok();
                }
                else
                {
                    ModelState.AddModelError("Investimento", "Investimento não encontrado");
                    return NotFound(ModelState.Values.SelectMany(v => v.Errors));
                } 
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Prevê o valor de um investimento
        /// POST api/Investimentos/Prever/id
        /// </summary>
        [HttpPost("Prever/{id}")]
        public async Task<IActionResult> PreverValor([FromRoute]int id, [FromBody]DateTime data)
        {
            try
            {
                var investimento = await context.Investimento
                    .Include(i => i.Moeda)
                    .Include(i => i.TipoInvestimento)
                    .FirstOrDefaultAsync(i => i.Id.Equals(id));

                if (investimento != null)
                {
                    //O metodo para atualizar valor pode ser usado também para a previsão,
                    //pois ele retorna o valor em decimal referente a uma data passada por parâmetro 
                    decimal valorFuturo = AtualizarValor(investimento, data);
                    //Retorna o investimento e o valor futuro
                    return Ok(new { investimento, valorFuturo});
                }
                else
                {
                    ModelState.AddModelError("Investimento", "Investimento não encontrado");
                    return NotFound(ModelState.Values.SelectMany(v => v.Errors));
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.StackTrace);
            }
        }

        /// <summary>
        /// Adiciona mais dinheiro a um investimento
        /// POST api/Investimentos/Inserir/id
        /// </summary>
        [HttpPost("Inserir/{id}")]
        public async Task<IActionResult> InserirDinheiro([FromRoute]int id, [FromBody]Decimal valor)
        {
            try
            {
                var investimento = await context.Investimento
                    .Include(i => i.Moeda)
                    .Include(i => i.TipoInvestimento)
                    .FirstOrDefaultAsync(i => i.Id == id);

                if(investimento == null)
                {
                    ModelState.AddModelError("Investimento", "Investimento não encontrado");
                    return NotFound(ModelState.Values.SelectMany(v => v.Errors));
                }

                investimento.ValorAtual += valor;

                context.Investimento.Update(investimento);
                await context.SaveChangesAsync();
                return Ok(investimento);
            }
            catch (Exception e)
            {
                return BadRequest(e.StackTrace);
            }
        }

        private Decimal AtualizarValor(Investimento investimento, DateTime data)
        {
            int tempo = TempoEmDias(investimento, data);

            switch (investimento.EscalaTempo)
            {
                case EscalaTempo.Semanal:
                    tempo = (int)(tempo / 7);
                    break;
                case EscalaTempo.Quinzenal:
                    tempo = (int)(tempo / 15);
                    break;
                case EscalaTempo.Mensal:
                    tempo = (int)(tempo / 30);
                    break;
                case EscalaTempo.Anual:
                    tempo = (int)(tempo / 360);
                    break;
            }

            return CalcularValorFuturo(investimento, tempo);
        }

        private int TempoEmDias(Investimento investimento, DateTime data)
        {
            return (data.Date - investimento.DataInicio.Date).Days;
        }

        private Decimal CalcularValorFuturo(Investimento investimento, int tempo)
        {
            double tempoD = (double)tempo;

            //Formula para juros compostos
            double valorD = (double)investimento.ValorInvestido * Math.Pow(1 + investimento.TipoInvestimento.Taxa, tempoD);

            //Os passos abaixo são feitos para garantir a precisão, o procedimento utilizado garante 2 digitos de precisão
            valorD *= 100;

            //Trunca o valor para que o mesmo não seja arredondado, causando erro no valor real
            int valorI = (int)Math.Truncate(valorD);

            //Passa o valor para decimal e divide por 100 para voltar ao valor certo
            decimal valorM = new Decimal(valorI);
            valorM = decimal.Divide(valorM, 100);

            return valorM;
        }
    }
}