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
    [Route("api/Movimentacoes")]
    //[Authorize]
    public class MovimentacoesController : Controller
    {
        private JarbasContext context;

        public MovimentacoesController(JarbasContext ctx)
        {
            context = ctx;
        }

        /// <summary>
        /// Cria uma nova movimentação
        /// POST api/Movimentacoes
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Movimentacao movimentacao)
        {
            var conta = await context.ContaContabil.FirstOrDefaultAsync(c => c.Id.Equals(movimentacao.ContaContabilId));

            if(conta != null)
            {
                bool usuarioExists = await context.Usuario.AnyAsync(u => u.Id.Equals(conta.UsuarioId));

                if (usuarioExists)
                {
                    if (movimentacao.TipoMovimentacao == TipoMovimentacao.Receita)
                    {
                        conta.Saldo += movimentacao.Valor;
                    }
                    else if (movimentacao.TipoMovimentacao == TipoMovimentacao.Despesa)
                    {
                        if(verificarSaldo(conta, movimentacao))
                        {
                            conta.Saldo -= movimentacao.Valor;
                        }
                        else
                        {
                            ModelState.AddModelError("Conta", "Saldo insuficiente.");
                            return BadRequest(ModelState.Values.SelectMany(e => e.Errors));
                        }
                    }
                    else
                    {
                        ModelState.AddModelError("Movimentação", "Informe um tipo de movimentação válido");
                        return BadRequest(ModelState.Values.SelectMany(e => e.Errors));
                    }

                    context.Movimentacao.Add(movimentacao);
                    context.ContaContabil.Update(conta);

                    await context.SaveChangesAsync();

                    return CreatedAtAction("Create", movimentacao);
                }
                else
                {
                    ModelState.AddModelError("Usuario", "Usurio no cadastrado no sistema.");
                    return NotFound(ModelState.Values.SelectMany(e => e.Errors));
                }
            }
            else
            {
                ModelState.AddModelError("Conta", "Conta no cadastrada no sistema.");
                return NotFound(ModelState.Values.SelectMany(e => e.Errors));
            }
        }

        /// <summary>
        /// Retorna todas as movimentações do usuário
        /// Get api/Movimentacoes/Usuario/{userId}
        /// </summary>
        [HttpGet("Usuario/{userId}")]
        public IActionResult GetUser([FromRoute] string userId)
        {
            var contas = context.ContaContabil.Where(c => c.UsuarioId.Equals(userId));

            var movimentacoes = context.Movimentacao.Where(m => m.ContaContabil.UsuarioId.Equals(userId));

            return Ok(movimentacoes);
        }

        /// <summary>
        /// Retorna uma movimentação específica
        /// Get api/Movimentacoes/{id}
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] int id)
        {
            var movimentacao = await context.Movimentacao.FirstOrDefaultAsync(m => m.Id.Equals(id));

            if (movimentacao != null)
            {
                return Ok(movimentacao);
            }
            else
            {
                ModelState.AddModelError("Usuario", "Movimentaao no encontrada.");
                return NotFound(ModelState.Values.SelectMany(e => e.Errors));
            }
        }

        // PUT: api/Movimentacoes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMovimentacao([FromRoute] int id, [FromBody] Movimentacao movimentacao)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != movimentacao.Id)
            {
                return BadRequest();
            }

            context.Entry(movimentacao).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MovimentacaoExists(id))
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

        // DELETE: api/Movimentacoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovimentacao([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var movimentacao = await context.Movimentacao.SingleOrDefaultAsync(m => m.Id == id);
            if (movimentacao == null)
            {
                return NotFound();
            }

            context.Movimentacao.Remove(movimentacao);
            await context.SaveChangesAsync();

            return Ok(movimentacao);
        }

        private bool MovimentacaoExists(int id)
        {
            return context.Movimentacao.Any(e => e.Id == id);
        }

        private bool verificarSaldo(ContaContabil conta, Movimentacao movimentacao)
        {
            if ((conta.Saldo - movimentacao.Valor) < 0)
            {
                return false;
            }

            return true;
        }

    }
}