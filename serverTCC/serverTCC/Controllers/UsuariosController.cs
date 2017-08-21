using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using serverTCC.Data;
using serverTCC.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Text;
using serverTCC.Services;
using AcessoGoogle;

namespace serverTCC.Controllers
{
    [Produces("application/json")]
    [Route("api/Usuarios")]
    [Authorize]
    public class UsuariosController : Controller
    {
        private UserManager<Usuario> userManager;
        private IUserValidator<Usuario> userValidator;
        private IPasswordValidator<Usuario> passwordValidator;
        private IPasswordHasher<Usuario> passwordHasher;
        private JarbasContext context;

        public UsuariosController(UserManager<Usuario> usrMgr, IUserValidator<Usuario> usrValid,
            IPasswordValidator<Usuario> passValid, IPasswordHasher<Usuario> passHasher, JarbasContext ctx)
        {
            userManager = usrMgr;
            userValidator = usrValid;
            passwordValidator = passValid;
            passwordHasher = passHasher;
            context = ctx;
        }

        /// <summary>
        /// Cria um novo usu�rio
        /// POST api/Usuarios
        /// </summary>
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Create([FromBody] UsuarioModel model)
        {
            try
            {
                Usuario usuario = await userManager.FindByEmailAsync(model.Email);

                if (usuario == null)
                {
                    usuario = new Usuario
                    {
                        Nome = model.Nome,
                        Email = model.Email,
                        UserName = model.Email
                    };

                    //valida a senha (De acordo com regras definidas no startup)
                    IdentityResult validPass = await passwordValidator.ValidateAsync(userManager, usuario, model.Senha);

                    if (!validPass.Succeeded)
                    {
                        ModelState.AddModelError("Senha", "Senha invalida");
                    }

                    //se a valida��o foi bem sucedida, cadastra o usu�rio
                    if (validPass.Succeeded)
                    {
                        //tenta criar o usu�rio
                        IdentityResult result = await userManager.CreateAsync(usuario, model.Senha);

                        //verifica se o usu�rio foi criado
                        if (result.Succeeded)
                        {
                            return CreatedAtAction("Create", usuario);
                        }
                        else
                        {
                            ModelState.AddModelError("Usuario", "Usu�rio n�o p�de ser criado");
                            return BadRequest(ModelState.Values.SelectMany(e => e.Errors));
                        }
                    }
                    else
                    {
                        return BadRequest(ModelState.Values.SelectMany(e => e.Errors));
                    }
                }
                else
                {
                    ModelState.AddModelError("Email", "Email j� foi cadastrado");
                    return BadRequest(ModelState.Values.SelectMany(e => e.Errors));
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Cria um novo usu�rio com informa��es do google
        /// POST api/Usuarios/Google/{idToken}
        /// </summary>
        [HttpPost("Google")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateGoogle([FromBody] string idToken)
        {
            try
            {
                //Usa biblioteca para acessar o google e pegar o perfil
                GetProfile getProfile = new GetProfile();

                //Classe com os campos de retorno do google
                ObjetoGoogle profile = await getProfile.Acessar(idToken);

                if (profile != null)
                {
                    UsuarioModel model = new UsuarioModel
                    {
                        Email = profile.email,
                        Nome = profile.name,
                        Senha = Guid.NewGuid().ToString()
                    };

                    return await Create(model);
                }
                else
                {
                    ModelState.AddModelError("Google", "Erro ao obter informa��es do Google, tente novamente");
                    return BadRequest(ModelState.Values.SelectMany(e => e.Errors));
                }
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }           
        }

        /// <summary>
        /// Busca o usu�rio por sua ID
        /// GET api/Usuarios/ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute]string id)
        {
            try
            {
                Usuario usuario = await context.Usuario
                    .Include(u => u.Perfil)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => u.Id.Equals(id));

                if (usuario != null)
                {
                    return Ok(usuario);
                }
                else
                {
                    ModelState.AddModelError("Usuario", "Usu�rio n�o encontrado");
                    return NotFound(ModelState.Values.SelectMany(v => v.Errors));
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }

        }

        /// <summary>
        /// Busca o usu�rio por seu Email
        /// GET api/Usuarios/Email/EMAIL
        /// </summary>
        [HttpGet("Email/{email}")]
        public async Task<IActionResult> GetByEmail([FromRoute]string email)
        {
            try
            {
                Usuario usuario = await context.Usuario
                    .Include(u => u.Perfil)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => u.Email.Equals(email));

                if (usuario != null)
                {
                    return Ok(usuario);
                }
                else
                {
                    ModelState.AddModelError("Usuario", "Usu�rio n�o encontrado");
                    return NotFound(ModelState.Values.SelectMany(v => v.Errors));
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Edita um usu�rio existente
        /// PUT api/Usuarios/ID
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> EditUser([FromRoute] string id, [FromBody] UsuarioModel model)
        {
            try
            {
                //variavel para indicar que o email n�o foi alterado
                bool email = false;
                //variavel para indicar que a senha n�o foi alterada
                bool pass = false;
                //variavel para efetuar valida��o de email
                IdentityResult validEmail = new IdentityResult();
                //variavel para efetuar valida��o de senha
                IdentityResult validPass = new IdentityResult();

                Usuario usuario = await userManager.FindByIdAsync(id);

                if (usuario != null)
                {
                    //verifica se o email n�o foi alterado
                    if ((!usuario.Email.Equals(model.Email)) && (!string.IsNullOrEmpty(model.Email)))
                    {
                        //validar email do usuario
                        usuario.Email = model.Email;
                        usuario.UserName = model.Email;
                        validEmail = await userValidator.ValidateAsync(userManager, usuario);

                        if (!validEmail.Succeeded)
                        {
                            ModelState.AddModelError("Email", "E-mail j� cadastrado");
                        }
                    }
                    else
                    {
                        email = true;
                    }

                    //validar senha(se foi passada)
                    if (!string.IsNullOrEmpty(model.Senha))
                    {
                        validPass = await passwordValidator.ValidateAsync(userManager, usuario, model.Senha);

                        if (validPass.Succeeded)
                        {
                            usuario.PasswordHash = passwordHasher.HashPassword(usuario, model.Senha);
                        }
                        else
                        {
                            ModelState.AddModelError("Senha", "Senha invalida");
                        }
                    }
                    else
                    {
                        pass = true;
                    }

                    if ((validEmail.Succeeded || email) && (validPass.Succeeded || pass))
                    {
                        usuario.Nome = model.Nome;

                        IdentityResult result = await userManager.UpdateAsync(usuario);

                        if (result.Succeeded)
                        {
                            return Ok(usuario);
                        }
                    }

                    return BadRequest(ModelState.Values.SelectMany(v => v.Errors));
                }
                else
                {
                    ModelState.AddModelError("Usuario", "Usu�rio n�o encontrado");
                    return NotFound(ModelState.Values.SelectMany(v => v.Errors));
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }

        }

        /// <summary>
        /// Edita/Adiciona um perfil de um usu�rio existente
        /// PUT api/Usuarios/Perfil/ID
        /// </summary>
        [HttpPut("Perfil/{id}")]
        public async Task<IActionResult> EditPerfil([FromRoute] string id, [FromBody] Perfil perfil)
        {
            try
            {
                Usuario usuario = await context.Usuario
                    .Include(u => u.Perfil)
                    .FirstOrDefaultAsync(u => u.Id.Equals(id));

                if (usuario != null)
                {
                    //Caso o usu�rio n�o tenha um perfil, � necess�rio uma instancia, para poder passar os valores
                    if (usuario.Perfil == null)
                    {
                        usuario.Perfil = new Perfil();
                    }

                    //Se passar o objeto inteiro, o entity framework ignora o antigo e cria um novo perfil, com nova ID
                    usuario.Perfil.Valor = perfil.Valor;
                    usuario.Perfil.MoedaId = perfil.MoedaId;
                    usuario.Perfil.RendaFixa = perfil.RendaFixa;
                    usuario.Perfil.Profissao = perfil.Profissao;
                    usuario.Perfil.FaixaEtaria = perfil.FaixaEtaria;
                    usuario.Perfil.EscalaTempo = perfil.EscalaTempo;

                    context.Usuario.Update(usuario);

                    //Retorna as informa��es corretas da moeda aplicada ao perfil
                    usuario.Perfil.Moeda = await context.Moeda.FirstOrDefaultAsync(m => m.Id.Equals(usuario.Perfil.MoedaId));

                    await context.SaveChangesAsync();

                    return Ok(usuario);
                }
                else
                {
                    ModelState.AddModelError("Usuario", "Usu�rio n�o encontrado");
                }

                return BadRequest(ModelState.Values.SelectMany(v => v.Errors));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Deleta um perfil de um usu�rio existente
        /// DELETE api/Usuarios/Perfil/ID
        /// </summary>
        [HttpDelete("Perfil/{id}")]
        public async Task<IActionResult> DeletePerfil([FromRoute] string id)
        {
            try
            {
                Usuario usuario = await context.Usuario
                    .Include(u => u.Perfil)
                    .FirstOrDefaultAsync(u => u.Id.Equals(id));

                if (usuario != null)
                {
                    if (usuario.Perfil != null)
                    {
                        context.Perfil.Remove(usuario.Perfil);

                        await context.SaveChangesAsync();
                    }

                    return Ok(usuario);
                }
                else
                {
                    ModelState.AddModelError("Usuario", "Usu�rio n�o encontrado");
                    return NotFound(ModelState.Values.SelectMany(v => v.Errors));
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Deleta um usu�rio existente
        /// DELETE api/Usuarios/ID
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser([FromRoute] string id)
        {
            try
            {
                Usuario usuario = await context.Usuario
                    .Include(u => u.Perfil)
                    .FirstOrDefaultAsync(u => u.Id.Equals(id));

                if (usuario != null)
                {
                    if (usuario.Perfil != null)
                    {
                        context.Perfil.Remove(usuario.Perfil);
                    }
                    context.Usuario.Remove(usuario);

                    await context.SaveChangesAsync();

                    return Ok();
                }
                else
                {
                    ModelState.AddModelError("Usuario", "Usu�rio n�o encontrado");
                    return NotFound(ModelState.Values.SelectMany(v => v.Errors));
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Envia codigo de recupera��o para o usu�rio
        /// POST api/Usuarios/Enviar/EMAIL
        /// </summary>
        [HttpPost("Enviar/{email}")]
        [AllowAnonymous]
        public async Task<IActionResult> EnviarCodigo([FromRoute] string email)
        {
            try
            {
                Usuario usuario = await context.Usuario.FirstOrDefaultAsync(u => u.Email.Equals(email));

                if (usuario != null)
                {
                    EmailService emailService = new EmailService();

                    //cria��o do codigo
                    string codigo = new Random().Next(100000, 999999).ToString();

                    string assunto = "Recupera��o de senha Jarbas";

                    string mensagem =
                        $"Ol� {usuario.Nome},\n\n" +
                        $"Este � o seu c�digo para recupera��o de senha: {codigo}\n" +
                        "Se voc� n�o solicitou uma recupera��o de senha no app Jarbas, ignore este e-mail.\n\n" +
                        "Atenciosamente,\n" +
                        "Project Jarbas Team";

                    bool emailEnviado = await emailService.SendEmail(email, mensagem, assunto, usuario.Nome);

                    if (emailEnviado)
                    {
                        var recuperacaoSenha = new RecuperacaoSenha
                        {
                            UsuarioId = usuario.Id,
                            Codigo = codigo
                        };

                        //busca se existe algum codigo antigo, para que o usu�rio tenha somente um codigo para recupera��o de senha
                        var oldCodigo = await context.RecuperacaoSenha.FirstOrDefaultAsync(r => r.UsuarioId.Equals(usuario.Id));
                        if (oldCodigo != null)
                        {
                            context.RecuperacaoSenha.Remove(oldCodigo);
                        }

                        context.RecuperacaoSenha.Add(recuperacaoSenha);
                        await context.SaveChangesAsync();

                        return Ok();
                    }
                    else
                    {
                        ModelState.AddModelError("Email", "Email n�o pode ser enviado, tente novamente");
                        return BadRequest(ModelState.Values.SelectMany(e => e.Errors));
                    }
                }
                else
                {
                    ModelState.AddModelError("Usuario", "Usu�rio n�o cadastrado no sistema.");
                    return NotFound(ModelState.Values.SelectMany(e => e.Errors));
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }

        }

        /// <summary>
        /// Recupera a senha do usu�rio
        /// POST api/Usuarios/Recuperar
        /// </summary>
        [HttpPost("Recuperar")]
        [AllowAnonymous]
        public async Task<IActionResult> RecuperarSenha([FromBody] RecuperacaoModel model)
        {
            try
            {
                var usuario = await context.Usuario.FirstOrDefaultAsync(u => u.Email.Equals(model.Email));

                if (usuario != null)
                {
                    var recuperacao = await context.RecuperacaoSenha
                        .FirstOrDefaultAsync(r => (r.Codigo.Equals(model.Codigo)) && (r.UsuarioId.Equals(usuario.Id)));

                    if ((recuperacao != null))
                    {
                        var validPass = await passwordValidator.ValidateAsync(userManager, usuario, model.Senha);

                        if (validPass.Succeeded)
                        {
                            usuario.PasswordHash = passwordHasher.HashPassword(usuario, model.Senha);

                            context.Usuario.Update(usuario);

                            context.RecuperacaoSenha.Remove(recuperacao);

                            await context.SaveChangesAsync();

                            return Ok();
                        }
                        else
                        {
                            ModelState.AddModelError("Senha", "Senha invalida");
                            return BadRequest(ModelState.Values.SelectMany(e => e.Errors));
                        }
                    }

                    ModelState.AddModelError("Codigo", "C�digo invalido");
                    return BadRequest(ModelState.Values.SelectMany(e => e.Errors));
                }
                else
                {
                    ModelState.AddModelError("Usuario", "Usu�rio n�o encontrado");
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
