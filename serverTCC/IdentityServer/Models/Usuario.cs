using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace IdentityServer.Models
{
    public class Usuario : IdentityUser
    {
        public string Nome { get; set; }
        public int? PerfilId { get; set; }
        //public Perfil Perfil { get; set; }
    }
}