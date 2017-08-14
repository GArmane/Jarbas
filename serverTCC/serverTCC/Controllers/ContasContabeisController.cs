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
    [Route("api/ContasContabeis")]
    //[Authorize]
    public class ContasContabeisController : Controller
    {
        private readonly JarbasContext context;

        public ContasContabeisController(JarbasContext ctx)
        {
            context = ctx;
        }

        /// <summary>
        /// Cria uma nova conta contabil
        /// POST api/ContasContabeis
        /// </summary>
        /// <param name="contaContabil"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ContaContabil contaContabil)
        {
            bool usuarioExists = await context.Usuario.AnyAsync(u => u.Id.Equals(contaContabil.UsuarioId));

            if (usuarioExists)
            {
                bool contaExists = await context.ContaContabil.AnyAsync(c => c.Nome.Equals(contaContabil.Nome));

                if (!contaExists)
                {
                    context.ContaContabil.Add(contaContabil);

                    await context.SaveChangesAsync();

                    return CreatedAtAction("Create", contaContabil);
                }
                else
                {
                    ModelState.AddModelError("Nome", "Esse nome de conta já esta sendo utilizado");
                    return NotFound(ModelState.Values.SelectMany(e => e.Errors));

                }
            }
            else
            {
                ModelState.AddModelError("Usuario", "Usuário não cadastrado no sistema.");
                return NotFound(ModelState.Values.SelectMany(e => e.Errors));
            }



        }

        // GET: api/ContasContabeis
        [HttpGet]
        public IEnumerable<ContaContabil> GetContaContabil()
        {
            return context.ContaContabil;
        }

        // GET: api/ContasContabeis/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetContaContabil([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var contaContabil = await context.ContaContabil.SingleOrDefaultAsync(m => m.Id == id);

            if (contaContabil == null)
            {
                return NotFound();
            }

            return Ok(contaContabil);
        }

        // PUT: api/ContasContabeis/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutContaContabil([FromRoute] int id, [FromBody] ContaContabil contaContabil)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != contaContabil.Id)
            {
                return BadRequest();
            }

            context.Entry(contaContabil).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContaContabilExists(id))
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

        // DELETE: api/ContasContabeis/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContaContabil([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var contaContabil = await context.ContaContabil.SingleOrDefaultAsync(m => m.Id == id);
            if (contaContabil == null)
            {
                return NotFound();
            }

            context.ContaContabil.Remove(contaContabil);
            await context.SaveChangesAsync();

            return Ok(contaContabil);
        }

        private bool ContaContabilExists(int id)
        {
            return context.ContaContabil.Any(e => e.Id == id);
        }
    }
}