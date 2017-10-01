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
    [Route("api/GrupoMovimentacoes")]
    [Authorize]
    public class GrupoMovimentacoesController : Controller
    {
        private JarbasContext context;

        public GrupoMovimentacoesController(JarbasContext ctx)
        {
            context = ctx;
        }

        /// <summary>
        /// Cria um novo grupo de movimentações
        /// POST api/GrupoMovimentacoes
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] GrupoMovimentacoes grupo)
        {
            try
            {
                var usuarioExists = await context.Usuario.AnyAsync(u => u.Id.Equals(grupo.UsuarioId));

                if (usuarioExists)
                {
                    var nomeExists = await context.GrupoMovimentacoes.AnyAsync(g => g.Nome.Equals(grupo.Nome) && g.UsuarioId.Equals(grupo.UsuarioId));

                    if (!nomeExists)
                    {
                        context.GrupoMovimentacoes.Add(grupo);
                        await context.SaveChangesAsync();
                        return CreatedAtAction("Create", grupo);
                    }
                    else
                    {
                        ModelState.AddModelError("Nome", "Esse nome de grupo de movimentações já esta sendo utilizado");
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
        /// Busca todos os grupos de movimentações do usuário
        /// GET api/GrupoMovimentacoes/Usuario/{userId}
        /// </summary>
        [HttpGet("Usuario/{userId}")]
        public IActionResult GetUser([FromRoute] string userId)
        {
            try
            {
                var grupos = context.GrupoMovimentacoes.Where(g => g.UsuarioId.Equals(userId));
                return Ok(grupos);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Busca um grupo de movimentações específico
        /// GET api/GrupoMovimentacoes/{id}
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] int id)
        {
            try
            {
                var grupoMovimentacoes = await context.GrupoMovimentacoes.FirstOrDefaultAsync(m => m.Id == id);

                if (grupoMovimentacoes != null)
                {
                    return Ok(grupoMovimentacoes);
                }
                else
                {
                    ModelState.AddModelError("Grupo", "Grupo de movimentações não encontrado");
                    return NotFound(ModelState.Values.SelectMany(v => v.Errors));
                }     
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
            
        }

        /// <summary>
        /// Edita um grupo de movimentações
        /// PUT api/GrupoMovimentacoes/{id}
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Edit([FromRoute] int id, [FromBody] GrupoMovimentacoes grupo)
        {
            try
            {
                var grupoExists = await context.GrupoMovimentacoes.AnyAsync(c => c.Id.Equals(id));

                if (grupoExists)
                {
                    var usuarioExists = await context.Usuario.AnyAsync(u => u.Id.Equals(grupo.UsuarioId));
                    if (usuarioExists)
                    {
                        context.GrupoMovimentacoes.Update(grupo);
                        await context.SaveChangesAsync();
                        return Ok(grupo);
                    }
                    else
                    {
                        ModelState.AddModelError("Usuario", "Usuário não cadastrado no sistema.");
                        return NotFound(ModelState.Values.SelectMany(e => e.Errors));
                    }
                }
                else
                {
                    ModelState.AddModelError("Grupo", "Grupo de movimentações não encontrado");
                    return NotFound(ModelState.Values.SelectMany(v => v.Errors));
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Deleta um grupo de movimentações
        /// DELETE api/GrupoMovimentacoes/{id}
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            try
            {
                var grupoMovimentacoes = await context.GrupoMovimentacoes.FirstOrDefaultAsync(g => g.Id.Equals(id));

                if (grupoMovimentacoes != null)
                {
                    context.GrupoMovimentacoes.Remove(grupoMovimentacoes);
                    await context.SaveChangesAsync();

                    return Ok();
                }
                else
                {
                    ModelState.AddModelError("Grupo", "Grupo de movimentações não encontrado");
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