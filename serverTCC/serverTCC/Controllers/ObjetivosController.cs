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
    [Authorize]
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

                if(objetivo == null)
                {
                    ModelState.AddModelError("Objetivo", "Objetivo não encontrado");
                    return NotFound(ModelState.Values.SelectMany(v => v.Errors));
                }

                context.Objetivo.Remove(objetivo);
                await context.SaveChangesAsync();
                return Ok();
            }
            catch(Exception e)
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

                if(objetivo == null)
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
    }
}