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
        /// Cria uma nova movimenta��o
        /// POST api/Movimentacoes
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Movimentacao movimentacao)
        {
            try
            {
                var conta = await context.ContaContabil.FirstOrDefaultAsync(c => c.Id.Equals(movimentacao.ContaContabilId));

                if (conta != null)
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
                            if (verificarSaldo(conta, movimentacao))
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
                            ModelState.AddModelError("Movimenta��o", "Informe um tipo de movimenta��o v�lido");
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
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Retorna todas as movimenta��es do usu�rio
        /// Get api/Movimentacoes/Usuario/{userId}
        /// </summary>
        [HttpGet("Usuario/{userId}")]
        public IActionResult GetUser([FromRoute] string userId)
        {
            try
            {
                var contas = context.ContaContabil.Where(c => c.UsuarioId.Equals(userId));

                var movimentacoes = context.Movimentacao.Where(m => m.ContaContabil.UsuarioId.Equals(userId));

                return Ok(movimentacoes);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }   
        }

        /// <summary>
        /// Retorna uma movimenta��o espec�fica
        /// Get api/Movimentacoes/{id}
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] int id)
        {
            try
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
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }          
        }

        /// <summary>
        /// Edita uma movimenta��o
        /// PUT api/Movimentacoes/{id}
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Edit([FromRoute] int id, [FromBody] Movimentacao movimentacao)
        {
            try
            {
                var movimentacaoAux = await context.Movimentacao
                    .Include(m => m.ContaContabil)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(m => m.Id.Equals(id));

                var conta = movimentacaoAux.ContaContabil;

                if (movimentacaoAux != null)
                {
                    //Primeiro v� o tipo da movimenta��o original e volta o valor para a conta, para ent�o editar
                    if(movimentacaoAux.TipoMovimentacao == TipoMovimentacao.Receita)
                    {
                        conta.Saldo -= movimentacaoAux.Valor;
                    }
                    else
                    {
                        conta.Saldo += movimentacaoAux.Valor;
                    }

                    //Edita a conta conforme a nova movimenta��o
                    if (movimentacao.TipoMovimentacao == TipoMovimentacao.Receita)
                    {
                        conta.Saldo += movimentacao.Valor;
                    }
                    else
                    {
                        conta.Saldo -= movimentacao.Valor;
                    }

                    context.Movimentacao.Update(movimentacao);
                    context.ContaContabil.Update(conta);
                    await context.SaveChangesAsync();
                    return Ok(movimentacao);
                }
                else
                {
                    ModelState.AddModelError("Movimenta��o", "Movimenta��o n�o encontrada.");
                    return NotFound(ModelState.Values.SelectMany(e => e.Errors));
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Apaga uma movimenta��o
        /// DELETE api/Movimentacoes/{id}
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            try
            {
                var movimentacao = await context.Movimentacao
                    .Include(m => m.ContaContabil)
                    .FirstOrDefaultAsync(m => m.Id.Equals(id));

                var conta = movimentacao.ContaContabil;

                if (movimentacao != null)
                {
                    if (movimentacao.TipoMovimentacao == TipoMovimentacao.Receita)
                    {
                        conta.Saldo -= movimentacao.Valor;
                    }
                    else
                    {
                        conta.Saldo += movimentacao.Valor;
                    }

                    context.Movimentacao.Remove(movimentacao);
                    context.ContaContabil.Update(conta);
                    await context.SaveChangesAsync();

                    return Ok();
                }
                else
                {
                    ModelState.AddModelError("Movimenta��o", "Movimen��o n�o encontrada.");
                    return NotFound(ModelState.Values.SelectMany(e => e.Errors));
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }        
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