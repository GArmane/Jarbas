using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using serverTCC.Data;
using serverTCC.Models;
using Microsoft.EntityFrameworkCore;

namespace serverTCC.Controllers
{
    [Produces("application/json")]
    [Route("api/Moedas")]
    public class MoedasController : Controller
    {
        private readonly JarbasContext context;

        public MoedasController(JarbasContext ctx)
        {
            this.context = ctx;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var moedas = context.Moeda;
            return Ok(moedas);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateCotacoes([FromBody] Moeda moeda)
        {
            try
            {
                var moedaAux = await context.Moeda.AsNoTracking().FirstOrDefaultAsync(m => m.Nome.Equals(moeda.Nome));

                if(moedaAux != null)
                {
                    moeda.Id = moedaAux.Id;
                    moedaAux = moeda;
                    context.Moeda.Update(moedaAux);
                }
                else
                {
                    context.Moeda.Add(moeda);
                }             
                
                await context.SaveChangesAsync();
                return Ok(moeda);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}