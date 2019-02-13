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

        [Route("")]
        [HttpGet]
        public async Task<ActionResult<Game[]>> GetByName(string name = null)
        {
            if (name is null)
                return await getAllGames();

            int hoursToGoBackInTime;
            bool nothingFound = false;
            switch (name)
            {
                case "alltime":
                    hoursToGoBackInTime = 1000000;
                    break;
                case "month":
                    hoursToGoBackInTime = 31 * 24;
                    throw new NotImplementedException();
                case "week":
                    hoursToGoBackInTime = 7 * 24;
                    throw new NotImplementedException();
                case "day":
                    hoursToGoBackInTime = 24;
                    throw new NotImplementedException();
                case "hour":
                    hoursToGoBackInTime = 1;
                    throw new NotImplementedException();
                default:
                    hoursToGoBackInTime = -1;
                    nothingFound = true;
                    break;
            }
            // DAMN, this is the ugliest hack ever! (I almost get proud :-)
            if (nothingFound)
            {
                // Didn't find "alltime", "week", "day" or "hour", so we should return for a person instead
                return await getGamesForName(name);
            }
            else
            {
                return await getGamesForThisManyHoursBackInTime(hoursToGoBackInTime);
            }
        }

        [HttpPost]
        public async Task<ActionResult<GamePostResponse>> Post(Game[] games)
        {
            var gameIds = await submitGames(games);

            var response = new GamePostResponse(gameIds);

            return response;
        }

        private Task<Game[]> getAllGames()
        {
            return context.Games.OrderByDescending(g => g.Id).ToArrayAsync();
        }

        private Task<Game[]> getGamesForThisManyHoursBackInTime(int hoursToGoBackInTime)
        {
            return context.Games.Where(g => g.LastUpdatedUtc > DateTime.UtcNow.Subtract(TimeSpan.FromHours(hoursToGoBackInTime))).OrderByDescending(g => g.Id).ToArrayAsync();
        }

        private Task<Game[]> getGamesForName(string name)
        {
            return context.Games.Where(g => g.PlayerRed1.Equals(name, StringComparison.InvariantCultureIgnoreCase)
                || g.PlayerRed2.Equals(name, StringComparison.InvariantCultureIgnoreCase)
                || g.PlayerBlue1.Equals(name, StringComparison.InvariantCultureIgnoreCase)
                || g.PlayerBlue2.Equals(name, StringComparison.InvariantCultureIgnoreCase))
                .OrderByDescending(g => g.Id)
                .Take(10)
                .ToArrayAsync();
        }

        private async Task<int[]> submitGames(Game[] games)
        {
            context.Games.AddRange(games);
            await context.SaveChangesAsync();

            return games.Select(g => g.Id).ToArray();
        }
    }
}
