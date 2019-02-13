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
    [Route("api/rankings")]
    public class RankingsController : Controller
    {
        private readonly FoosballContext context;

        public RankingsController(FoosballContext context)
        {
            this.context = context;
        }

        [HttpGet]
        [Route("{hoursBackInTime}")]
        public async Task<ActionResult<Ranking[]>> Get(string hoursBackInTime)
        {
            int hoursToGoBackInTime = -1;
            string filter = "";
            switch (hoursBackInTime)
            {
                case "alltime":
                    hoursToGoBackInTime = 1000000;
                    filter = "newElo";
                    break;
                case "alltime-onlylunch":
                    hoursToGoBackInTime = 1000000;
                    filter = "onlylunch";
                    throw new NotImplementedException();
                case "alltime-ratiofocus":
                    hoursToGoBackInTime = 1000000;
                    filter = "ratiofocus";
                    throw new NotImplementedException();
                case "alltime-elo":
                    hoursToGoBackInTime = 1000000;
                    filter = "elo";
                    throw new NotImplementedException();
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
                    throw new NotImplementedException();
            }

            var games = await context.Games.Where(g => g.LastUpdatedUtc > DateTime.UtcNow.Subtract(TimeSpan.FromHours(hoursToGoBackInTime))).OrderByDescending(g => g.Id).ToArrayAsync();

            var rankings = GenerateRankings(games, filter);

            return rankings.ToArray();
        }

        private IEnumerable<Ranking> GenerateRankings(IEnumerable<Game> games, string filter)
        {
            IDictionary<string, int> scores = new Dictionary<string, int>();
            IDictionary<string, int> numberOfGames = new Dictionary<string, int>();

            if (filter == "newElo")
            {
                foreach (var game in games)
                {
                    // Ensure all players have an initial ranking, if they haven't already played before
                    if (game.PlayerBlue1 != null && !scores.ContainsKey(game.PlayerBlue1)) scores.Add(game.PlayerBlue1, 1500);
                    if (game.PlayerBlue2 != null && !scores.ContainsKey(game.PlayerBlue2)) scores.Add(game.PlayerBlue2, 1500);
                    if (game.PlayerRed1 != null && !scores.ContainsKey(game.PlayerRed1)) scores.Add(game.PlayerRed1, 1500);
                    if (game.PlayerRed2 != null && !scores.ContainsKey(game.PlayerRed2)) scores.Add(game.PlayerRed2, 1500);

                    // Ensure all players are registred in the numberOfGames, if they haven't already played before
                    if (game.PlayerBlue1 != null && !numberOfGames.ContainsKey(game.PlayerBlue1)) numberOfGames.Add(game.PlayerBlue1, 0);
                    if (game.PlayerBlue2 != null && !numberOfGames.ContainsKey(game.PlayerBlue2)) numberOfGames.Add(game.PlayerBlue2, 0);
                    if (game.PlayerRed1 != null && !numberOfGames.ContainsKey(game.PlayerRed1)) numberOfGames.Add(game.PlayerRed1, 0);
                    if (game.PlayerRed2 != null && !numberOfGames.ContainsKey(game.PlayerRed2)) numberOfGames.Add(game.PlayerRed2, 0);

                    // Add to number of games
                    if (game.PlayerBlue1 != null) numberOfGames[game.PlayerBlue1]++;
                    if (game.PlayerBlue2 != null) numberOfGames[game.PlayerBlue2]++;
                    if (game.PlayerRed1 != null) numberOfGames[game.PlayerRed1]++;
                    if (game.PlayerRed2 != null) numberOfGames[game.PlayerRed2]++;


                    // Then add their games
                    if (game.MatchWinner.Equals("blue", StringComparison.InvariantCultureIgnoreCase))
                    {
                        if (game.PlayerBlue1 != null) scores[game.PlayerBlue1] += game.PointsAtStake;
                        if (game.PlayerBlue2 != null) scores[game.PlayerBlue2] += game.PointsAtStake;
                        if (game.PlayerRed1 != null) scores[game.PlayerRed1] -= game.PointsAtStake;
                        if (game.PlayerRed2 != null) scores[game.PlayerRed2] -= game.PointsAtStake;
                    }
                    else if (game.MatchWinner.Equals("red", StringComparison.InvariantCultureIgnoreCase))
                    {
                        if (game.PlayerRed1 != null) scores[game.PlayerRed1] += game.PointsAtStake;
                        if (game.PlayerRed2 != null) scores[game.PlayerRed2] += game.PointsAtStake;
                        if (game.PlayerBlue1 != null) scores[game.PlayerBlue1] -= game.PointsAtStake;
                        if (game.PlayerBlue2 != null) scores[game.PlayerBlue2] -= game.PointsAtStake;
                    }
                    else if (game.MatchWinner.Equals("draw", StringComparison.InvariantCultureIgnoreCase))
                    {
                        if (game.PlayerBlue1 != null) scores[game.PlayerBlue1] += game.PointsAtStake;
                        if (game.PlayerBlue2 != null) scores[game.PlayerBlue2] += game.PointsAtStake;
                        if (game.PlayerRed1 != null) scores[game.PlayerRed1] += game.PointsAtStake;
                        if (game.PlayerRed2 != null) scores[game.PlayerRed2] += game.PointsAtStake;
                    }
                }
            }
            else
            {
                foreach (var game in games)
                {
                    if (game.PlayerBlue1 != null && !numberOfGames.ContainsKey(game.PlayerBlue1)) numberOfGames.Add(game.PlayerBlue1, 0);
                    if (game.PlayerBlue2 != null && !numberOfGames.ContainsKey(game.PlayerBlue2)) numberOfGames.Add(game.PlayerBlue2, 0);
                    if (game.PlayerRed1 != null && !numberOfGames.ContainsKey(game.PlayerRed1)) numberOfGames.Add(game.PlayerRed1, 0);
                    if (game.PlayerRed2 != null && !numberOfGames.ContainsKey(game.PlayerRed2)) numberOfGames.Add(game.PlayerRed2, 0);

                    if (game.PlayerBlue1 != null) numberOfGames[game.PlayerBlue1]++;
                    if (game.PlayerBlue2 != null) numberOfGames[game.PlayerBlue2]++;
                    if (game.PlayerRed1 != null) numberOfGames[game.PlayerRed1]++;
                    if (game.PlayerRed2 != null) numberOfGames[game.PlayerRed2]++;

                    // Then add their games
                    if (game.MatchWinner.Equals("blue", StringComparison.InvariantCultureIgnoreCase))
                    {
                        if (game.PlayerBlue1 != null && !scores.ContainsKey(game.PlayerBlue1)) scores.Add(game.PlayerBlue1, game.PointsAtStake);
                        if (game.PlayerBlue2 != null && !scores.ContainsKey(game.PlayerBlue2)) scores.Add(game.PlayerBlue2, game.PointsAtStake);
                        if (game.PlayerRed1 != null && !scores.ContainsKey(game.PlayerRed1)) scores.Add(game.PlayerRed1, -game.PointsAtStake);
                        if (game.PlayerRed2 != null && !scores.ContainsKey(game.PlayerRed2)) scores.Add(game.PlayerRed2, -game.PointsAtStake);

                        if (game.PlayerBlue1 != null) scores[game.PlayerBlue1] += game.PointsAtStake;
                        if (game.PlayerBlue2 != null) scores[game.PlayerBlue2] += game.PointsAtStake;
                        if (game.PlayerRed1 != null) scores[game.PlayerRed1] -= game.PointsAtStake;
                        if (game.PlayerRed2 != null) scores[game.PlayerRed2] -= game.PointsAtStake;
                    }
                    else if (game.MatchWinner.Equals("red", StringComparison.InvariantCultureIgnoreCase))
                    {
                        if (game.PlayerRed1 != null && !scores.ContainsKey(game.PlayerRed1)) scores.Add(game.PlayerRed1, game.PointsAtStake);
                        if (game.PlayerRed2 != null && !scores.ContainsKey(game.PlayerRed2)) scores.Add(game.PlayerRed2, game.PointsAtStake);
                        if (game.PlayerBlue1 != null && !scores.ContainsKey(game.PlayerBlue1)) scores.Add(game.PlayerBlue1, -game.PointsAtStake);
                        if (game.PlayerBlue2 != null && !scores.ContainsKey(game.PlayerBlue2)) scores.Add(game.PlayerBlue2, -game.PointsAtStake);

                        if (game.PlayerRed1 != null) scores[game.PlayerRed1] += game.PointsAtStake;
                        if (game.PlayerRed2 != null) scores[game.PlayerRed2] += game.PointsAtStake;
                        if (game.PlayerBlue1 != null) scores[game.PlayerBlue1] -= game.PointsAtStake;
                        if (game.PlayerBlue2 != null) scores[game.PlayerBlue2] -= game.PointsAtStake;
                    }
                    else if (game.MatchWinner.Equals("draw", StringComparison.InvariantCultureIgnoreCase))
                    {
                        if (game.PlayerRed1 != null && !scores.ContainsKey(game.PlayerRed1)) scores.Add(game.PlayerRed1, game.PointsAtStake);
                        if (game.PlayerRed2 != null && !scores.ContainsKey(game.PlayerRed2)) scores.Add(game.PlayerRed2, game.PointsAtStake);
                        if (game.PlayerBlue1 != null && !scores.ContainsKey(game.PlayerBlue1)) scores.Add(game.PlayerBlue1, game.PointsAtStake);
                        if (game.PlayerBlue2 != null && !scores.ContainsKey(game.PlayerBlue2)) scores.Add(game.PlayerBlue2, game.PointsAtStake);

                        if (game.PlayerBlue1 != null) scores[game.PlayerBlue1] += game.PointsAtStake;
                        if (game.PlayerBlue2 != null) scores[game.PlayerBlue2] += game.PointsAtStake;
                        if (game.PlayerRed1 != null) scores[game.PlayerRed1] += game.PointsAtStake;
                        if (game.PlayerRed2 != null) scores[game.PlayerRed2] += game.PointsAtStake;
                    }
                }
            }

            var playersByScore = scores.ToLookup(s => s.Value, s => s.Key)
                .SelectMany(x => x.Select(y => (Score: x.Key, PlayerName: y)))
                .OrderBy(x => x.Score)
                .Select((x, i) => (Position: i + 1, x.Score, x.PlayerName))
                .Select(x => new Ranking(x.Position, x.Score, numberOfGames[x.PlayerName], x.PlayerName));

            return playersByScore;
        }
    }
}
