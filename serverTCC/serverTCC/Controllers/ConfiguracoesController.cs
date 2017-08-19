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
    //[Authorize]
    public class ConfiguracoesController : Controller
    {
        private readonly JarbasContext _context;

        public ConfiguracoesController(JarbasContext context)
        {
            this._context = context;
        }

        /// <summary>
        /// Retorna lista completa de configurações cadastradas.
        /// Para fins de desenvolvimento apenas.
        /// GET api/Configuracoes
        /// </summary>
        /// <returns></returns>
        public IEnumerable<Configuracoes> GetAll()
        {
            return _context.Configuracoes.ToList();
        }

        /// <summary>
        /// Retorna uma configuração específica.
        /// GET api/Configuracoes/{id}
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int Id)
        {
            try
            {
                var config = await _context
                    .Configuracoes
                    .FirstOrDefaultAsync(cfg => cfg.Id.Equals(Id));

                if (config != null)
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
        /// Retorna a configuração de usuário.
        /// GET api/Configuracoes/Usuario/{id}
        /// </summary>
        [HttpGet("Usuario/{userId}")]
        public async Task<IActionResult> GetUser([FromRoute] string userId)
        {
            try
            {
                var config = await _context
                    .Configuracoes
                    .FirstOrDefaultAsync(cfg => cfg.UsuarioId.Equals(userId));

                return Ok(config);
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
        public async Task<IActionResult> Create([FromBody] Configuracoes configuracoes)
        {
            try
            {
                bool usuarioExists = await _context
                    .Users
                    .AnyAsync(u => u.Id.Equals(configuracoes.UsuarioId));
            
                if (usuarioExists)
                {
                    var usuarioHasConfig = await _context
                        .Configuracoes
                        .AnyAsync(cfg => cfg.UsuarioId.Equals(configuracoes.UsuarioId));

                    if(!usuarioHasConfig)
                    {
                        _context.Configuracoes.Add(configuracoes);
                        await _context.SaveChangesAsync();
                        return CreatedAtAction("Create", configuracoes);
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
        [HttpPut("{id}")]
        public async Task<IActionResult> Edit([FromRoute] int id, [FromBody] Configuracoes configuracoes)
        {
            try
            {
                var config = await _context.Configuracoes.FirstOrDefaultAsync(cfg => cfg.Id.Equals(id));

                if(config != null)
                {
                    config.Idioma = configuracoes.Idioma;

                    _context.Configuracoes.Update(config);

                    await _context.SaveChangesAsync();

                    return Ok(config);
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
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            try
            {
                var configuracoes = await _context.Configuracoes.FirstOrDefaultAsync(cfg => cfg.Id.Equals(id));

                if(configuracoes != null) 
                {
                    _context.Configuracoes.Remove(configuracoes);
                    await _context.SaveChangesAsync();
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
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}