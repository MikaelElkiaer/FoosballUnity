using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FoosballUnity.Data;
using FoosballUnity.Model;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FoosballUnity.Controllers
{
    [Route("api/players")]
    public class PlayersController : Controller
    {
        private readonly FoosballContext context;

        public PlayersController(FoosballContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<ActionResult<Player[]>> GetAll()
        {
            var players = context.Players.ToAsyncEnumerable();

            return await players.ToArray();
        }

        [Route("{name}")]
        [HttpGet]
        public async Task<ActionResult<Player>> Get(string name)
        {
            var player = await context.Players.FindAsync(name);

            if (player is null)
                return NotFound();

            return player;
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody]Player player)
        {
            await context.Players.AddAsync(player);
            await context.SaveChangesAsync();

            return NoContent();
        }

        [Route("{name}")]
        [HttpPut]
        public async Task<ActionResult> Put(string name, [FromBody]Player player)
        {
            await context.Players.AddAsync(player);
            await context.SaveChangesAsync();

            return NoContent();
        }

        [Route("{name}")]
        [HttpDelete]
        public async Task<ActionResult> Delete(string name)
        {
            var player = await context.Players.FindAsync(name);

            if (player is null)
                return NotFound();

            context.Players.Remove(player);
            await context.SaveChangesAsync();

            return Ok();
        }
    }

}
