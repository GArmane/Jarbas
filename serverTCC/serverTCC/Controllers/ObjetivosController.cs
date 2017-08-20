using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using serverTCC.Data;
using serverTCC.Models;
using Microsoft.AspNetCore.Authorization;

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
                bool usuarioExists = await context.Usuario.AnyAsync(u => u.Id.Equals(objetivo.UsuarioId));

                if (usuarioExists)
                {
                    foreach (var objetivoConta in objetivo.ObjetivosConta)
                    {
                        if (objetivoConta.ContaContabilId != null)
                        {
                            var conta = await context.ContaContabil.FirstOrDefaultAsync(c => c.Id.Equals(objetivoConta.ContaContabilId));

                            if (conta != null)
                            {
                                var historico = objetivo.HistoricoObjetivo.FirstOrDefault();
                                var aux = decimal.Divide((decimal)objetivoConta.Porcentagem,100m);
                                historico.ValorFinal += decimal.Multiply(conta.Saldo, aux);
                            }
                            else
                            {
                                ModelState.AddModelError("ContaContabil", "Conta contábil invalida");
                                return NotFound(ModelState.Values.SelectMany(e => e.Errors));
                            }
                        }
                        else if (objetivoConta.InvestimentoId != null)
                        {
                            var investimento = await context.Investimento.FirstOrDefaultAsync(i => i.Id.Equals(objetivoConta.InvestimentoId));

                            if (investimento != null) 
                            {
                                var historico = objetivo.HistoricoObjetivo.FirstOrDefault();
                                var aux = decimal.Divide((decimal)objetivoConta.Porcentagem, 100m);
                                historico.ValorFinal += decimal.Multiply(investimento.ValorAtual, aux);
                            }
                            else
                            {
                                ModelState.AddModelError("Investimento", "Investimento invalido");
                                return NotFound(ModelState.Values.SelectMany(e => e.Errors));
                            }
                        }
                    }

                    context.Objetivo.Add(objetivo);

                    await context.SaveChangesAsync();

                    return CreatedAtAction("Create", objetivo);
                }
                else
                {
                    ModelState.AddModelError("Usuario", "Usuário não cadastrado no sistema.");
                    return NotFound(ModelState.Values.SelectMany(e => e.Errors));
                }
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
        /*[HttpGet("Usuario/{userId}")]
        public IActionResult GetUser([FromRoute] string userId)
        {
            try
            {
                var objetivos = context.Objetivo
                    .Include(o => o.ObjetivosConta)
                        .ThenInclude(o => o.IConta)
                    .Include(o => o.HistoricoObjetivo)
            }
        }*/

        // GET: api/Objetivos/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetObjetivo([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var objetivo = await context.Objetivo.SingleOrDefaultAsync(m => m.Id == id);

            if (objetivo == null)
            {
                return NotFound();
            }

            return Ok(objetivo);
        }

        // PUT: api/Objetivos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutObjetivo([FromRoute] int id, [FromBody] Objetivo objetivo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != objetivo.Id)
            {
                return BadRequest();
            }

            context.Entry(objetivo).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ObjetivoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Objetivos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteObjetivo([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var objetivo = await context.Objetivo.SingleOrDefaultAsync(m => m.Id == id);
            if (objetivo == null)
            {
                return NotFound();
            }

            context.Objetivo.Remove(objetivo);
            await context.SaveChangesAsync();

            return Ok(objetivo);
        }

        private bool ObjetivoExists(int id)
        {
            return context.Objetivo.Any(e => e.Id == id);
        }
    }
}