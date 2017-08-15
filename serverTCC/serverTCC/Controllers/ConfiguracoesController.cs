using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using serverTCC.Data;
using serverTCC.Models;

namespace serverTCC.Controllers
{
    [Produces("application/json")]
    [Route("api/Configuracoes")]
    [Authorize]
    public class ConfiguracoesController : Controller
    {
        private readonly JarbasContext _context;

        public ConfiguracoesController(JarbasContext context)
        {
            this._context = context;
        }

        // Development test method only
        public IEnumerable<Configuracoes> GetAll()
        {
            return _context.Configuracoes.ToList();
        }

        // GET: api/Configuracoes/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int Id)
        {
            var config = await _context.Configuracoes.FirstOrDefaultAsync(cfg => cfg.Id.Equals(Id));

            if (config != null)
            {
                return Ok(config);
            }
            else
            {
                ModelState.AddModelError(
                    "Configuracoes", "Configurações de usuário não encontradas."
                );
                return NotFound(ModelState.Values.SelectMany(v => v.Errors));
            }
        }

        // POST: api/Configuracoes
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Configuracoes configuracoes)
        {
            var usuarioExists = await _context
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
                    _context.SaveChanges();
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

        // PUT: api/Configuracoes/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(
            [FromRoute] string userId,
            [FromBody] Configuracoes configuracoes)
        {
            var usuarioExists = await _context.Users.AnyAsync(u => u.Id.Equals(userId));
            
            if(usuarioExists) 
            {    
                var usuarioConfig = await _context
                .Configuracoes
                .FirstOrDefaultAsync(cfg => cfg.UsuarioId.Equals(userId));

                if(usuarioConfig != null)
                {
                    usuarioConfig.Idioma = configuracoes.Idioma;
                    _context.Configuracoes.Update(usuarioConfig);
                    await _context.SaveChangesAsync();
                    return Ok(usuarioConfig);
                }
                else
                {
                    ModelState.AddModelError(
                        "Configurações", "Usuário não possui configurações definidas"
                    );
                    return NotFound(ModelState.Values.SelectMany(v => v.Errors));
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

        // DELETE: api/Configuracores/{id}
        [HttpDelete]
        public async Task<IActionResult> Delete([FromRoute] int id)
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
    }
}