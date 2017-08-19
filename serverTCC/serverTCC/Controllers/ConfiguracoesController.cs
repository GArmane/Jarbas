using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using serverTCC.Data;
using serverTCC.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace serverTCC.Controllers
{
    [Produces("application/json")]
    [Route("api/Configuracoes")]
    // [Authorize]
    public class ConfiguracoesController : Controller
    {
        private readonly JarbasContext context;

        public ConfiguracoesController(JarbasContext ctx)
        {
            this.context = ctx;
        }

        /// <summary>
        /// Retorna a configuração de usuário.
        /// GET api/Configuracoes/Usuario/{id}
        /// </summary>
        [HttpGet("{userId}")]
        public async Task<IActionResult> Get([FromRoute] string userId)
        {
            try
            {
                var config = await context
                    .Configuracoes
                    .FirstOrDefaultAsync(cfg => cfg.UsuarioId.Equals(userId));

                if(config != null)
                {
                    return Ok(config);
                }
                else
                {
                    ModelState.AddModelError("Configuracoes", "Configurações de usuário não encontradas.");
                    return NotFound(ModelState.Values.SelectMany(v => v.Errors));
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Cria uma nova configuração de usuário.
        /// POST api/Configuracoes
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Configuracoes config)
        {
            try
            {
                bool usuarioExists = await context
                    .Users
                    .AnyAsync(u => u.Id.Equals(config.UsuarioId));
            
                if (usuarioExists)
                {
                    var usuarioHasConfig = await context
                        .Configuracoes
                        .AnyAsync(cfg => cfg.UsuarioId.Equals(config.UsuarioId));

                    if(!usuarioHasConfig)
                    {
                        context.Configuracoes.Add(config);
                        await context.SaveChangesAsync();
                        return CreatedAtAction("Create", config);
                    }
                    else
                    {
                        ModelState.AddModelError(
                            "Configuracoes", "Configurações de usuário já existentes."
                        );
                        return BadRequest(ModelState.Values.SelectMany(v => v.Errors));
                    }
                }
                else
                {
                    ModelState.AddModelError(
                        "Usuario", "Usuário não cadastrado no sistema."
                    );
                    return NotFound(ModelState.Values.SelectMany(v => v.Errors));
                }
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Edita uma configuração existente.
        /// PUT api/Configuracoes/{id}
        /// </summary>
        [HttpPut("{userId}")]
        public async Task<IActionResult> Edit([FromRoute] string userId, [FromBody] Configuracoes config)
        {
            try
            {
                var configBD = await context.Configuracoes.FirstOrDefaultAsync(cfg => cfg.UsuarioId.Equals(userId));

                if(config != null)
                {
                    configBD.Idioma = config.Idioma;

                    context.Configuracoes.Update(configBD);

                    await context.SaveChangesAsync();

                    return Ok(configBD);
                }
                else
                {
                    ModelState.AddModelError("Configuracoes", "Configurações não encontradas.");
                    return NotFound(ModelState.Values.SelectMany(v => v.Errors));
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Deleta uma configuração existente.
        /// DELETE api/Configuracoes/{id}
        /// </summary>
        [HttpDelete("{userId}")]
        public async Task<IActionResult> Delete([FromRoute] string userId)
        {
            try
            {
                var configBD = await context.Configuracoes.FirstOrDefaultAsync(cfg => cfg.UsuarioId.Equals(userId));

                if(configBD != null)
                {
                    context.Configuracoes.Remove(configBD);
                    await context.SaveChangesAsync();
                    return Ok();
                }
                else
                {
                    ModelState.AddModelError(
                        "Configuracoes", "Configurações não encontradas no sistemas."
                    );
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