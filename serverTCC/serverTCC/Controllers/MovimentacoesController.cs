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
    [Route("api/Movimentacoes")]
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
                            if (VerificarSaldo(conta, movimentacao))
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
                        ModelState.AddModelError("Usuario", "Usuário não cadastrado no sistema.");
                        return NotFound(ModelState.Values.SelectMany(e => e.Errors));
                    }
                }
                else
                {
                    ModelState.AddModelError("Conta", "Conta não cadastrada no sistema.");
                    return NotFound(ModelState.Values.SelectMany(e => e.Errors));
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Retorna todas as movimentações e transferencias do usuário
        /// GET api/Movimentacoes/Usuario/{userId}
        /// </summary>
        [HttpGet("Usuario/{userId}")]
        public IActionResult GetUser([FromRoute] string userId)
        {
            try
            {
                var contas = context.ContaContabil.Where(c => c.UsuarioId.Equals(userId));

                var movimentacoes = context.Movimentacao.Where(m => m.ContaContabil.UsuarioId.Equals(userId));

                var transferencias = context.Transferencia.Where(t => t.Receita.ContaContabil.UsuarioId.Equals(userId));

                return Ok(new { movimentacoes, transferencias });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }   
        }

        /// <summary>
        /// Retorna uma movimentação específica
        /// GET api/Movimentacoes/{id}
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
        /// Edita uma movimentação
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
                    //Primeiro vê o tipo da movimentação original e volta o valor para a conta, para então editar
                    if(movimentacaoAux.TipoMovimentacao == TipoMovimentacao.Receita)
                    {
                        conta.Saldo -= movimentacaoAux.Valor;
                    }
                    else
                    {
                        conta.Saldo += movimentacaoAux.Valor;
                    }

                    //Edita a conta conforme a nova movimentação
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
                    ModelState.AddModelError("Movimentação", "Movimentação não encontrada.");
                    return NotFound(ModelState.Values.SelectMany(e => e.Errors));
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Apaga uma movimentação
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
                    ModelState.AddModelError("Movimentação", "Movimenção não encontrada.");
                    return NotFound(ModelState.Values.SelectMany(e => e.Errors));
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }        
        }

        /// <summary>
        /// Verifica o saldo de uma conta
        /// </summary>
        private bool VerificarSaldo(ContaContabil conta, Movimentacao movimentacao)
        {
            if ((conta.Saldo - movimentacao.Valor) < 0)
            {
                return false;
            }

            return true;
        }

        /// <summary>
        /// Cria uma nova transferencia
        /// POST api/Movimentacoes/Transferencia
        /// </summary>
        [HttpPost("Transferencia")]
        public async Task<IActionResult> CreateTransferencia([FromBody] Transferencia transferencia)
        {
            var aux = await Create(transferencia.Despesa);

            if (aux is CreatedAtActionResult despesa)
            {
                aux = await Create(transferencia.Receita);

                if (aux is CreatedAtActionResult receita)
                {
                    transferencia.DespesaId = (despesa.Value as Movimentacao).Id;
                    transferencia.Despesa = despesa.Value as Movimentacao;

                    transferencia.ReceitaId = (receita.Value as Movimentacao).Id;
                    transferencia.Receita = receita.Value as Movimentacao;

                    context.Transferencia.Add(transferencia);
                    await context.SaveChangesAsync();

                    return CreatedAtAction("CreateTransferencia", transferencia);
                }
                else
                {
                    var rmDespesa = await Delete((despesa.Value as Movimentacao).Id);
                    return aux;
                }
            }
            else
            {
                return aux;
            }
        }
    }
}