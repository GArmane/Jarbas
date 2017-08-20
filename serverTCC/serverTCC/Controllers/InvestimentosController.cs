using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using serverTCC.Data;
using serverTCC.Models;

namespace serverTCC.Controllers
{
    [Produces("application/json")]
    [Route("api/Investimentos")]
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

        // GET: api/Investimentos
        [HttpGet]
        public IEnumerable<Investimento> GetInvestimento()
        {
            return context.Investimento;
        }

        // GET: api/Investimentos/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetInvestimento([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var investimento = await context.Investimento.SingleOrDefaultAsync(m => m.Id == id);

            if (investimento == null)
            {
                return NotFound();
            }

            return Ok(investimento);
        }

        // PUT: api/Investimentos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInvestimento([FromRoute] int id, [FromBody] Investimento investimento)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != investimento.Id)
            {
                return BadRequest();
            }

            context.Entry(investimento).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InvestimentoExists(id))
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

        // DELETE: api/Investimentos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvestimento([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var investimento = await context.Investimento.SingleOrDefaultAsync(m => m.Id == id);
            if (investimento == null)
            {
                return NotFound();
            }

            context.Investimento.Remove(investimento);
            await context.SaveChangesAsync();

            return Ok(investimento);
        }

        private bool InvestimentoExists(int id)
        {
            return context.Investimento.Any(e => e.Id == id);
        }
    }
}