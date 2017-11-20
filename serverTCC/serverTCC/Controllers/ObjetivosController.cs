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
    [Route("api/Objetivos")]
    //[Authorize]
    public class ObjetivosController : Controller
    {
        private JarbasContext context;

        public ObjetivosController(JarbasContext ctx)
        {
            context = ctx;
        }

        /// <summary>
        /// Cria um novo objetivo
        /// POST api/Objetivos
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Objetivo objetivo)
        {
            try
            {
                var usuarioExists = await context.Usuario.AnyAsync(u => u.Id == objetivo.UsuarioId);

                if (!usuarioExists)
                {
                    ModelState.AddModelError("Usuario", "Usuário não encontrado");
                    return NotFound(ModelState.Values.SelectMany(v => v.Errors));
                }

                var moedaExists = await context.Moeda.AnyAsync(m => m.Id == objetivo.MoedaId);

                if (!moedaExists)
                {
                    ModelState.AddModelError("Usuario", "Moeda não encontrada");
                    return NotFound(ModelState.Values.SelectMany(v => v.Errors));
                }

                context.Objetivo.Add(objetivo);

                await context.SaveChangesAsync();

                return CreatedAtAction("Create", objetivo);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Retorna todos os objetivos do usuário
        /// GET api/Objetivos/Usuario/{userId}
        /// </summary>
        [HttpGet("Usuario/{userId}")]
        public IActionResult GetUser([FromRoute] string userId)
        {
            try
            {
                var objetivos = context.Objetivo
                    .Include(o => o.HistoricoObjetivo)
                    .Where(o => o.UsuarioId == userId);

                return Ok(objetivos);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Retorna um objetivos do usuário
        /// GET api/Objetivos/Usuario/{userId}
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] int id)
        {
            try
            {
                var objetivo = await context.Objetivo
                    .Include(o => o.HistoricoObjetivo)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (objetivo != null)
                {
                    return Ok(objetivo);
                }
                else
                {
                    ModelState.AddModelError("Objetivo", "Objetivo não encontrado");
                    return NotFound(ModelState.Values.SelectMany(v => v.Errors));
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Edita um objetivo
        /// PUT api/Objetivos/{id}
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Edit([FromRoute] int id, [FromBody] Objetivo objetivo)
        {
            try
            {
                var objetivoExists = await context.Objetivo.AnyAsync(o => o.Id == id);

                if (!objetivoExists)
                {
                    ModelState.AddModelError("Objetivo", "Objetivo não encontrado");
                    return NotFound(ModelState.Values.SelectMany(v => v.Errors));
                }

                var usuarioExists = await context.Usuario.AnyAsync(u => u.Id == objetivo.UsuarioId);

                if (!usuarioExists)
                {
                    ModelState.AddModelError("Usuario", "Usuário não encontrado");
                    return NotFound(ModelState.Values.SelectMany(v => v.Errors));
                }

                context.Objetivo.Update(objetivo);
                await context.SaveChangesAsync();
                return Ok(objetivo);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Apaga um objetivo
        /// DELETE api/Objetivos/{id}
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            try
            {
                var objetivo = await context.Objetivo.FirstOrDefaultAsync(o => o.Id == id);

                if (objetivo == null)
                {
                    ModelState.AddModelError("Objetivo", "Objetivo não encontrado");
                    return NotFound(ModelState.Values.SelectMany(v => v.Errors));
                }

                context.Objetivo.Remove(objetivo);
                await context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Arquiva um objetivo
        /// POST api/Objetivos/Arquivar/{id}
        /// </summary>
        [HttpPost("Arquivar/{id}")]
        public async Task<IActionResult> Arquivar([FromRoute] int id)
        {
            try
            {
                var objetivo = await context.Objetivo.FirstOrDefaultAsync(o => o.Id == id);

                if (objetivo == null)
                {
                    ModelState.AddModelError("Objetivo", "Objetivo não encontrado");
                    return NotFound(ModelState.Values.SelectMany(v => v.Errors));
                }

                objetivo.Arquivar = true;

                context.Objetivo.Update(objetivo);
                await context.SaveChangesAsync();
                return Ok(objetivo);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Adiciona mais dinheiro a um objetivo
        /// POST api/Objetivos/Inserir/id
        /// </summary>
        [HttpPost("Inserir/{id}")]
        public async Task<IActionResult> InserirDinheiro([FromRoute]int id, [FromBody]Decimal valor)
        {
            try
            {
                var objetivo = await context.Objetivo
                    .Include(o => o.HistoricoObjetivo)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (objetivo == null)
                {
                    ModelState.AddModelError("Objetivo", "Objetivo não encontrado");
                    return NotFound(ModelState.Values.SelectMany(v => v.Errors));
                }

                objetivo.Valor += valor;

                context.Objetivo.Update(objetivo);
                await context.SaveChangesAsync();
                return Ok(objetivo);
            }
            catch (Exception e)
            {
                return BadRequest(e.StackTrace);
            }
        }

        /// <summary>
        /// Transfere dinheiro de uma conta para um objetivo
        /// POST api/Objetivos/TransferirFromConta/{contaId}/{objetivoId}
        /// </summary>
        [HttpPost("TransferirFromConta/{contaId}/{objetivoId}")]
        public async Task<IActionResult> TransferirFromConta([FromRoute] int contaId, [FromRoute] int objetivoId, [FromBody] decimal valor)
        {
            try
            {
                var contaController = new ContasContabeisController(context);
                var movController = new MovimentacoesController(context);

                var aux = await contaController.Get(contaId);
                if (!(aux is OkObjectResult contaObject))
                {
                    return aux;
                }
                var conta = contaObject.Value as ContaContabil;

                aux = await Get(objetivoId);
                if (!(aux is OkObjectResult objetivoObject))
                {
                    return aux;
                }
                var objetivo = objetivoObject.Value as Objetivo;

                if (!movController.VerificarSaldo(conta, valor))
                {
                    ModelState.AddModelError("Conta", "Saldo insuficiente.");
                    return BadRequest(ModelState.Values.SelectMany(e => e.Errors));
                }

                conta.Saldo -= valor;
                objetivo.Valor += valor;

                context.ContaContabil.Update(conta);
                context.Objetivo.Update(objetivo);
                await context.SaveChangesAsync();
                return Ok(new { objetivo, conta });
            }
            catch (Exception e)
            {
                return BadRequest(e.StackTrace);
            }
        }


        /// <summary>
        /// Transfere dinheiro de um objetivo para uma conta
        /// POST api/Objetivos/TransferirToConta/{contaId}/{objetivoId}
        /// </summary>
        [HttpPost("TransferirToConta/{contaId}/{objetivoId}")]
        public async Task<IActionResult> TransferirToConta([FromRoute] int contaId, [FromRoute] int objetivoId, [FromBody] decimal valor)
        {
            try
            {
                var contaController = new ContasContabeisController(context);
                var movController = new MovimentacoesController(context);

                var aux = await contaController.Get(contaId);
                if (!(aux is OkObjectResult contaObject))
                {
                    return aux;
                }
                var conta = contaObject.Value as ContaContabil;

                aux = await Get(objetivoId);
                if (!(aux is OkObjectResult objetivoObject))
                {
                    return aux;
                }
                var objetivo = objetivoObject.Value as Objetivo;

                if (!VerificarSaldo(objetivo, valor))
                {
                    ModelState.AddModelError("Objetivo", "Saldo insuficiente.");
                    return BadRequest(ModelState.Values.SelectMany(e => e.Errors));
                }

                conta.Saldo += valor;
                objetivo.Valor -= valor;

                context.ContaContabil.Update(conta);
                context.Objetivo.Update(objetivo);
                await context.SaveChangesAsync();
                return Ok(new { objetivo, conta });
            }
            catch (Exception e)
            {
                return BadRequest(e.StackTrace);
            }
        }

        /// <summary>
        /// Verifica o saldo de um objetivo
        /// </summary>
        public bool VerificarSaldo(Objetivo objetivo, decimal valor)
        {
            if ((objetivo.Valor - valor) < 0)
            {
                return false;
            }

            return true;
        }
    }
}