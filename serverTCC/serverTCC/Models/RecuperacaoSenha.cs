using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace serverTCC.Models
{
    public class RecuperacaoSenha
    {
        public int Id { get; set; }

        public string UsuarioId { get; set; }
        public Usuario Usuario { get; set; }

        public string Codigo { get; set; }
    }
}
