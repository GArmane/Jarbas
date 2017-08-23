using IdentityServer4.Validation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
//using static IdentityModel.OidcConstants;
using AcessoGoogle;
using Microsoft.EntityFrameworkCore;
using IdentityServer.Data;
using IdentityServer4.Models;

namespace IdentityServer.Utils
{
    public class GoogleGrantValidator : IExtensionGrantValidator
    {
        private IdentityContext identityContext;

        public GoogleGrantValidator(IdentityContext ctx)
        {
            identityContext = ctx;
        }

        public string GrantType => "googleAuth";

        public async Task ValidateAsync(ExtensionGrantValidationContext context)
        {
            var userToken = context.Request.Raw.Get("id_token");

            if (string.IsNullOrEmpty(userToken))
            {
                context.Result = new GrantValidationResult(TokenRequestErrors.InvalidGrant, "Token não pode ser nulo");
                return;
            }

            //Usa biblioteca para acessar o google e pegar o perfil
            GetProfile getProfile = new GetProfile();

            //Classe com os campos de retorno do google
            ObjetoGoogle profile = await getProfile.Acessar(userToken);

            if(profile != null)
            {
                var usuario = await identityContext.Usuario.FirstOrDefaultAsync(u => u.Email.Equals(profile.email));

                if (usuario != null)
                {
                    context.Result = new GrantValidationResult(usuario.Id, "google");
                    return;
                }
                else
                {
                    context.Result = new GrantValidationResult(TokenRequestErrors.InvalidGrant, "Usuário não cadastrado");
                    return;
                }
            }
            else
            {
                context.Result = new GrantValidationResult(TokenRequestErrors.InvalidGrant, "Erro ao obter informações do Google, tente novamente");
                return;
            }
        }
    }
}
