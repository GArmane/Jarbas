using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using serverTCC.Models;
using System;
using System.Linq;

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
