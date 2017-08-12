using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using serverTCC.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

        public UsuariosController(UserManager<Usuario> usrMgr, IUserValidator<Usuario> usrValid,
            IPasswordValidator<Usuario> passValid, IPasswordHasher<Usuario> passHasher)
        {
            userManager = usrMgr;
            userValidator = usrValid;
            passwordValidator = passValid;
            passwordHasher = passHasher;
        }

        /// <summary>
        /// Cria um novo usu�rio
        /// POST api/Usuarios
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UsuarioModel model)
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

        /// <summary>
        /// Busca o usu�rio por sua ID
        /// GET api/Usuarios/ID
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute]string id)
        {
            Usuario usuario = await userManager.FindByIdAsync(id);

            if(usuario != null)
            {
                return Ok(usuario);
            }
            else
            {
                ModelState.AddModelError("Usuario", "Usu�rio n�o encontrado");
                return NotFound(ModelState.Values.SelectMany(v => v.Errors));
            }
        }

        /// <summary>
        /// Busca o usu�rio por seu Email
        /// GET api/Usuarios/Email/EMAIL
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        [HttpGet("Email/{email}")]
        public async Task<IActionResult> GetByEmail([FromRoute]string email)
        {
            Usuario usuario = await userManager.FindByEmailAsync(email);

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

        /// <summary>
        /// Edita um usu�rio existente
        /// PUT api/Usuarios/ID
        /// </summary>
        /// <param name="id"></param>
        /// <param name="usuario"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> EditUser([FromRoute] string id, [FromBody] UsuarioModel model)
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

        /// <summary>
        /// Edita/Adiciona um perfil de um usu�rio existente
        /// PUT api/Usuarios/Perfil/ID
        /// </summary>
        /// <param name="id"></param>
        /// <param name="perfil"></param>
        /// <returns></returns>
        [HttpPut("Perfil/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> EditPerfil([FromRoute] string id, [FromBody] Perfil perfil)
        {
            //CONTINUAR
        }
        
        /*
        // DELETE: api/Usuarios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var usuario = await _context.Usuario.SingleOrDefaultAsync(m => m.Id == id);
            if (usuario == null)
            {
                return NotFound();
            }

            _context.Usuario.Remove(usuario);
            await _context.SaveChangesAsync();

            return Ok(usuario);
        }*/
    }
}