using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace serverTCC.Models
{
    public class Usuario : IdentityUser
    {
        public string Nome { get; set; }
        public int PerfilId { get; set; }
        public Perfil Perfil { get; set; }
    }
}
