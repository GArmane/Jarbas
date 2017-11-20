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
    [Authorize]
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
                            if (VerificarSaldo(conta, movimentacao.Valor))
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

                var movimentacoes = context.Movimentacao
                    .Include(m => m.Agendamento)
                    .Where(m => m.ContaContabil.UsuarioId.Equals(userId));

                var transferencias = context.Transferencia
                    .Include(t => t.Despesa)
                        .ThenInclude(m => m.Agendamento)
                    .Include(t => t.Receita)
                    .Where(t => t.Receita.ContaContabil.UsuarioId.Equals(userId));

                foreach(var transf in transferencias)
                {
                    movimentacoes = movimentacoes.Where(m => (m.Id != transf.Despesa.Id) && (m.Id != transf.Receita.Id));
                }

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
                var movimentacao = await context.Movimentacao
                    .Include(m => m.Agendamento)
                    .FirstOrDefaultAsync(m => m.Id.Equals(id));

                if (movimentacao != null)
                {
                    return Ok(movimentacao);
                }
                else
                {
                    ModelState.AddModelError("Usuario", "Movimentação não encontrada.");
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
        public async Task<IActionResult> Edit([FromRoute] int id, [FromBody] Movimentacao movimentacao, bool fromTransferencia = false)
        {
            try
            {
                var movimentacaoAux = await context.Movimentacao
                    .Include(m => m.ContaContabil)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(m => m.Id.Equals(id));
               
                if (movimentacaoAux != null)
                {
                    var isTransferencia = await context.Transferencia.AnyAsync(t => (t.ReceitaId == id) || (t.DespesaId == id));

                    if (isTransferencia && !fromTransferencia)
                    {
                        ModelState.AddModelError("Transferencia", "Essa movimentação faz parte de uma transferencia, faça a alteração pela transferência");
                        return BadRequest(ModelState.Values.SelectMany(e => e.Errors));
                    }

                    var conta = movimentacaoAux.ContaContabil;

                    //Primeiro vê o tipo da movimentação original e volta o valor para a conta, para então editar
                    if (movimentacaoAux.TipoMovimentacao == TipoMovimentacao.Receita)
                    {
                        conta.Saldo -= movimentacaoAux.Valor;
                    }
                    else
                    {
                        conta.Saldo += movimentacaoAux.Valor;

                        //verifica se existe saldo suficiente para a edição da despesa
                        if(!VerificarSaldo(conta, movimentacao.Valor))
                        {
                            ModelState.AddModelError("Conta", "Saldo insuficiente.");
                            return BadRequest(ModelState.Values.SelectMany(e => e.Errors));
                        }
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
        public async Task<IActionResult> Delete([FromRoute] int id, bool fromTransferencia = false)
        {
            try
            {
                var movimentacao = await context.Movimentacao
                    .Include(m => m.ContaContabil)
                    .Include(m => m.Agendamento)
                    .FirstOrDefaultAsync(m => m.Id.Equals(id));

                if (movimentacao != null)
                {
                    //verifica se a movimentação faz parte de uma transferencia
                    var isTransferencia = await context.Transferencia.AnyAsync(t => (t.ReceitaId == id) || (t.DespesaId == id));

                    if (isTransferencia && !fromTransferencia)
                    {
                        ModelState.AddModelError("Transferencia", "Essa movimentação faz parte de uma transferencia, faça a remoção pela transferência");
                        return BadRequest(ModelState.Values.SelectMany(e => e.Errors));
                    }

                    var conta = movimentacao.ContaContabil;

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
        /// Verifica o saldo de uma conta
        /// </summary>
        public bool VerificarSaldo(ContaContabil conta, decimal valor)
        {
            if ((conta.Saldo - valor) < 0)
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
            try
            {
                //cria a despesa
                var aux = await Create(transferencia.Despesa);

                if (aux is CreatedAtActionResult despesa)
                {
                    //cria a receita
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
                        //em caso de erro na criação da receita, apaga e despesa e retorna o erro
                        var rmDespesa = await Delete((despesa.Value as Movimentacao).Id);
                        return aux;
                    }
                }
                else
                {
                    //retorna erro da criação de despesa
                    return aux;
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Retorna uma transferencia específica
        /// GET api/Movimentacoes/Transferencia/{id}
        /// </summary>
        [HttpGet("Transferencia/{id}")]
        public async Task<IActionResult> GetTransferencia([FromRoute] int id)
        {
            try
            {
                var transferencia = await context.Transferencia
                    .Include(t => t.Despesa)
                        .ThenInclude(m => m.Agendamento)
                    .Include(t => t.Receita)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(t => t.Id.Equals(id));

                if (transferencia != null)
                {
                    return Ok(transferencia);
                }
                else
                {
                    ModelState.AddModelError("Transferencia", "Transferencia não encontrada.");
                    return NotFound(ModelState.Values.SelectMany(e => e.Errors));
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Edita uma transferencia
        /// PUT api/Movimentacoes/Transferencia/{id}
        /// </summary>
        [HttpPut("Transferencia/{id}")]
        public async Task<IActionResult> EditTransferencia([FromRoute] int id, [FromBody] Transferencia transferencia)
        {
            try
            {
                //pega a transferencia original, para caso de erro na etapa de receita, poder voltar a despesa para como estava antes do request
                var oldAux = await GetTransferencia(id);

                if(oldAux is OkObjectResult oldTransferenciaObject)
                {
                    //Edita a despesa
                    var aux = await Edit(transferencia.Despesa.Id, transferencia.Despesa, fromTransferencia: true);

                    if (aux is OkObjectResult despesa)
                    {
                        //Edita a receita
                        aux = await Edit(transferencia.Receita.Id, transferencia.Receita, fromTransferencia: true);

                        if (aux is OkObjectResult receita)
                        {
                            //passa as movimentacoes atualizadas para o objeto que foi recebido no request e o retorna
                            transferencia.Despesa = despesa.Value as Movimentacao;

                            transferencia.Receita = receita.Value as Movimentacao;

                            return Ok(transferencia);
                        }
                        else
                        {
                            //volta a despesa para a anterior, em caso de sucesso na despesa e erro na receita
                            var oldTransferencia = oldTransferenciaObject.Value as Transferencia;
                            await Edit(oldTransferencia.DespesaId, oldTransferencia.Despesa);

                            //retorna o objeto com erro da edição da receita
                            return aux;
                        }
                    }
                    else
                    {
                        //retorna o objeto com erro da edição da despesa
                        return aux;
                    }
                }
                else
                {
                    return oldAux;
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Apaga uma transferencia
        /// DELETE api/Movimentacoes/Transferencia/{id}
        /// </summary>
        [HttpDelete("Transferencia/{id}")]
        public async Task<IActionResult> DeleteTransferencia([FromRoute] int id)
        {
            try
            {
                var transferencia = await context.Transferencia
                    .FirstOrDefaultAsync(m => m.Id.Equals(id));

                if(transferencia != null)
                {
                    await Delete(transferencia.DespesaId, fromTransferencia: true);
                    await Delete(transferencia.ReceitaId, fromTransferencia: true);
                    
                    //Não é necessário remover diretamente a transferencia, pois quando é deletada uma movimentação referente a essa transferencia
                    //o Entity Framework faz um delete em cascata, ou seja, apaga a transferencia junto, então só resta apagar a outra movimentação
                    //para manter a consistencia de dados

                    return Ok();
                }
                else
                {
                    ModelState.AddModelError("Transferencia", "Transferencia não encontrada.");
                    return NotFound(ModelState.Values.SelectMany(e => e.Errors));
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}