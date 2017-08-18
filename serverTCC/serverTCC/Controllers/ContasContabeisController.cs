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
    [Route("api/ContasContabeis")]
    [Authorize]
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
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ContaContabil contaContabil)
        {
            try
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
                        return BadRequest(ModelState.Values.SelectMany(e => e.Errors));

                    }
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
        /// Busca todas as contas contabeis do usuário
        /// GET api/ContasContabeis/Usuario/userId
        /// </summary>
        [HttpGet("Usuario/{userId}")]
        public IActionResult GetUser([FromRoute] string userId)
        {
            try
            {
                var contas = context.ContaContabil
                    .Include(c => c.Moeda)
                    .Where(c => c.UsuarioId.Equals(userId));

                return Ok(contas);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Busca uma conta contabil específica
        /// GET api/ContasContabeis/id
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] int id)
        {
            try
            {
                var contaContabil = await context.ContaContabil
                    .Include(c => c.Moeda)
                    .FirstOrDefaultAsync(c => c.Id.Equals(id));

                if (contaContabil != null)
                {
                    return Ok(contaContabil);
                }
                else
                {
                    ModelState.AddModelError("Usuario", "Conta contábil não encontrada");
                    return NotFound(ModelState.Values.SelectMany(v => v.Errors));
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Edita uma conta contabil existente
        /// PUT api/ContasContabeis/ID
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Edit([FromRoute] int id, [FromBody] ContaContabil contaContabil)
        {
            try
            {
                var contaAux = await context.ContaContabil.AsNoTracking().FirstOrDefaultAsync(c => c.Id.Equals(id));

                if (contaAux != null)
                {
                    contaAux = contaContabil;

                    context.ContaContabil.Update(contaAux);

                    await context.SaveChangesAsync();

                    return Ok(contaAux);
                }
                else
                {
                    ModelState.AddModelError("ContaContabil", "Conta contábil não encontrada.");
                    return NotFound(ModelState.Values.SelectMany(e => e.Errors));
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Deleta uma conta contabil existente
        /// DELETE api/ContasContabeis/ID
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            try
            {
                var contaContabil = await context.ContaContabil.FirstOrDefaultAsync(c => c.Id.Equals(id));

                if(contaContabil != null)
                {
                    context.ContaContabil.Remove(contaContabil);

                    await context.SaveChangesAsync();

                    return Ok();
                }
                else
                {
                    ModelState.AddModelError("ContaContabil", "Conta contábil não encontrada");
                    return NotFound(ModelState.Values.SelectMany(v => v.Errors));
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}