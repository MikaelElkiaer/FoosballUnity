using FoosballUnity.Data;
using FoosballUnity.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FoosballUnity.Controllers
{
    [Route("api/games")]
    public class GamesController : Controller
    {
        private readonly FoosballContext context;

        public GamesController(FoosballContext context)
        {
            this.context = context;
        }

        [Route("{name}")]
        [HttpGet]
        public async Task<ActionResult<Game[]>> GetByName(string name = null)
        {
            if (name is null)
                return await GetAllGames();

            int hoursToGoBackInTime;
            bool nothingFound = false;
            switch (name)
            {
                case "alltime":
                    hoursToGoBackInTime = 1000000;
                    break;
                case "month":
                    hoursToGoBackInTime = 31 * 24;
                    break;
                case "week":
                    hoursToGoBackInTime = 7 * 24;
                    break;
                case "day":
                    hoursToGoBackInTime = 24;
                    break;
                case "hour":
                    hoursToGoBackInTime = 1;
                    break;
                default:
                    hoursToGoBackInTime = -1;
                    nothingFound = true;
                    break;
            }
            // DAMN, this is the ugliest hack ever! (I almost get proud :-)
            if (nothingFound)
            {
                // Didn't find "alltime", "week", "day" or "hour", so we should return for a person instead
                return await GetGamesForName(name);
            }
            else
            {
                return await GetGamesForThisManyHoursBackInTime(hoursToGoBackInTime);
            }
        }

        [HttpPost]
        public async Task<ActionResult<GamePostResponse>> Post([FromBody]Game game)
        {
            var gameId = await SubmitGame(game);

            var response = new GamePostResponse(new[] { gameId });

            return response;
        }

        private Task<Game[]> GetAllGames()
        {
            return context.Games.OrderByDescending(g => g.Id).ToArrayAsync();
        }

        private Task<Game[]> GetGamesForThisManyHoursBackInTime(int hoursToGoBackInTime)
        {
            return context.Games.Where(g => g.LastUpdatedUtc > DateTime.UtcNow.Subtract(TimeSpan.FromHours(hoursToGoBackInTime))).OrderByDescending(g => g.Id).ToArrayAsync();
        }

        private Task<Game[]> GetGamesForName(string name)
        {
            return context.Games.Where(g => g.PlayerRed1 != null && g.PlayerRed1.Equals(name, StringComparison.InvariantCultureIgnoreCase)
                || g.PlayerRed2 != null && g.PlayerRed2.Equals(name, StringComparison.InvariantCultureIgnoreCase)
                || g.PlayerBlue1 != null && g.PlayerBlue1.Equals(name, StringComparison.InvariantCultureIgnoreCase)
                || g.PlayerBlue2 != null && g.PlayerBlue2.Equals(name, StringComparison.InvariantCultureIgnoreCase))
                .OrderByDescending(g => g.Id)
                .Take(10)
                .ToArrayAsync();
        }

        private async Task<int> SubmitGame(Game game)
        {
            context.Games.Add(game);
            await context.SaveChangesAsync();

            return game.Id.Value;
        }
    }
}
