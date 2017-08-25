using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using serverTCC.Data;
using serverTCC.Models;

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

        public async Task<IActionResult> Get()
        {
            var moedas = context.Moeda;
            return Ok(moedas);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Moeda moeda)
        {
            try
            {
                context.Moeda.Add(moeda);
                await context.SaveChangesAsync();
                return Ok(moeda);
            }
            catch(System.Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}