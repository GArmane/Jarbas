using IdentityServer4.Models;
using System.Collections.Generic;


namespace IdentityServer.Utils
{
    public class Config
    {
        //Recursos protegidos, nesse caso, a API
        public static IEnumerable<ApiResource> GetApiResources()
        {
            return new List<ApiResource>
            {
                new ApiResource("jarbasApi", "Jarbas API")
            };
        }

        //Clientes, quem pode se conectar ao Identity Server, nesse caso, o app do Ionic
        public static IEnumerable<Client> GetClients()
        {
            return new List<Client>
            {
                new Client
                {
                    ClientId = "jarbasApp",
                    ClientSecrets =
                    {
                        new Secret("secret".Sha256())
                    },
                    AllowedGrantTypes = GrantTypes.List(new [] {GrantType.ResourceOwnerPassword, "googleAuth"}),
                    AllowedScopes = {"jarbasApi", "offline_access"},
                    AllowOfflineAccess = true,
                    RefreshTokenUsage = TokenUsage.ReUse,
                    RefreshTokenExpiration = TokenExpiration.Sliding,
                    SlidingRefreshTokenLifetime = 60 * 60 * 24 * 7,
                    AccessTokenLifetime = 60 * 60 * 24 * 1,
                    AllowedCorsOrigins = {"http:localhost:8100"}
                }
            };
        }
    }
}
