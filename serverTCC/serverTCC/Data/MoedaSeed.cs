using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using serverTCC.Models;

namespace serverTCC.Data
{
    public static class MoedaSeed
    {
        public static void Seed(IApplicationBuilder app)
        {
            JarbasContext context = app.ApplicationServices.GetRequiredService<JarbasContext>();

            var realExists = context.Moeda.Any(m => m.Nome == "Real");

            if (!realExists)
            {
                Moeda moeda = new Moeda
                {
                    Simbolo = "BRL",
                    Nome = "Real",
                    CotacaoComercial = 1m,
                    UltimaConsulta = DateTime.Now,
                    Fonte = "default"
                };

                context.Moeda.Add(moeda);

                context.SaveChanges();
            }
        }
    }
}
