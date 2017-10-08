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
    [Authorize]
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
        public IActionResult GetUser([FromRoute] string userId)
        {
            try
            {
                var investimentos = context.Investimento
                    .Include(i => i.Moeda)
                    .Include(i => i.TipoInvestimento)
                    .Where(i => i.UsuarioId.Equals(userId));

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
    }
}