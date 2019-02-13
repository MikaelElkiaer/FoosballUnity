using FoosballUnity.Data;
using FoosballUnity.Model;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FoosballUnity.Controllers
{
    [Route("api/tournaments")]
    public class TournamentsController : Controller
    {
        private readonly FoosballContext context;

        public TournamentsController(FoosballContext context)
        {
            this.context = context;
        }

        [HttpPost]
        [Route("roundrequest")]
        public async Task<ActionResult<TournamentGameRound[]>> RequestGames([FromBody]TournamentPostRequest request)
        {
            var games = GenerateGames(request);

            return (await games).ToArray();
        }

        private Task<IEnumerable<TournamentGameRound>> GenerateGames(TournamentPostRequest game)
        {
            return Task.Factory.StartNew(() =>
            {

                var result = new List<Game>();

                var namesOfAvailablePlayers = game.Players.Select(p => p.Name).ToList();


                if (!game.Players?.Any() ?? false)
                {
                    return null;
                }
                int maxPlayersNeeded = 4 * game.NumberOfGames;
                if (namesOfAvailablePlayers.Count >= 0 && namesOfAvailablePlayers.Count <= 3)
                {
                    maxPlayersNeeded = namesOfAvailablePlayers.Count;
                }
                else if (namesOfAvailablePlayers.Count <= 5)
                {
                    // If only players for 1 table
                    if (maxPlayersNeeded > 4) maxPlayersNeeded = 4;
                }
                else if (namesOfAvailablePlayers.Count > 5 && namesOfAvailablePlayers.Count <= 7)
                {
                    maxPlayersNeeded = namesOfAvailablePlayers.Count;
                }
                else if (namesOfAvailablePlayers.Count <= 9)
                {
                    // If only players for 2 tables
                    if (maxPlayersNeeded > 8) maxPlayersNeeded = 8;
                }
                else if (namesOfAvailablePlayers.Count > 9 && namesOfAvailablePlayers.Count <= 11)
                {
                    maxPlayersNeeded = namesOfAvailablePlayers.Count;
                }
                else if (namesOfAvailablePlayers.Count <= 13)
                {
                    // If only players for 3 tables
                    if (maxPlayersNeeded > 12) maxPlayersNeeded = 12;
                }

                var newRealList = GenerateAwesomeList(maxPlayersNeeded, namesOfAvailablePlayers);

                Stack<string> realList = new Stack<string>(newRealList);
                int count = 0;

                while (realList.Any() && count < game.NumberOfGames)
                {
                    realList.TryPop(out string player_red_1);
                    realList.TryPop(out string player_red_2);
                    realList.TryPop(out string player_blue_1);
                    realList.TryPop(out string player_blue_2);

                    Game newGame = new Game(
                            null,
                            player_red_1,
                            player_red_2,
                            player_blue_1,
                            player_blue_2,
                            DateTime.UtcNow,
                            "",
                            -1,
                            -1);

                    // Don't return games, where there isn't at least 1 player on both teams
                    if (player_blue_1 != null)
                    {
                        result.Add(newGame);
                    }
                    count++;
                }

                var resultAsArray = new List<TournamentGameRound>();
                TournamentGameRound tournamentGameRound = new TournamentGameRound(result);
                resultAsArray.Add(tournamentGameRound);

                return resultAsArray.AsEnumerable();
            });
        }

        private IEnumerable<string> GenerateAwesomeList(int maxPlayersNeeded, List<string> namesOfAvailablePlayers)
        {
            // So now we have the available players and the max result we should send back (which is the same as the precise result)
            // Get all matches 1 hour back
            var games = context.Games.Where(g => g.LastUpdatedUtc > DateTime.UtcNow.Subtract(TimeSpan.FromHours(1))).OrderByDescending(g => g.Id).ToArray();


            int maxNumberOfRoundsBack = 25;
            int foundNumberOfRoundsBack = 0;

            List<Game> gamesToLookAt = new List<Game>();
            DateTime currentLastUpdatedDate = DateTime.MinValue;

            foreach (Game game in games)
            {
                DateTime gameLastUpdatedDate = game.LastUpdatedUtc;
                if (currentLastUpdatedDate == DateTime.MinValue)
                {
                    currentLastUpdatedDate = gameLastUpdatedDate;
                }

                double fromCurrentLastToThis = (currentLastUpdatedDate - gameLastUpdatedDate).TotalMilliseconds;
                //logger.info("######################Der er " + fromCurrentLastToThis + " millisekunders forskel");

                // Don't go futher, if there has been a long break
                if (fromCurrentLastToThis < 30 * 60 * 1000)
                {
                    if (currentLastUpdatedDate != gameLastUpdatedDate)
                    {
                        foundNumberOfRoundsBack++;
                        currentLastUpdatedDate = gameLastUpdatedDate;
                    }
                    else
                    {
                        currentLastUpdatedDate = gameLastUpdatedDate;
                    }
                    if (foundNumberOfRoundsBack < maxNumberOfRoundsBack)
                    {
                        gamesToLookAt.Add(game);
                    }
                }
            }

            // Doing it from the oldest to newest game, give 2^something points (just change the points_at_stake score for them, which is a hack)
            gamesToLookAt.Reverse();

            int currentValueForGame = 1;
            DateTime currentLastUpdated = DateTime.MinValue;

            foreach (Game game in gamesToLookAt)
            {
                DateTime gameLastUpdated = game.LastUpdatedUtc;

                if (currentLastUpdated != gameLastUpdated)
                {
                    if (currentLastUpdated != DateTime.MinValue)
                    {
                        currentValueForGame = currentValueForGame * 2;
                    }

                    currentLastUpdated = gameLastUpdated;
                }
                game.SetPointsAtStake(currentValueForGame);
            }

            // Then create array for all possible players
            IDictionary<string, int> currentPlayerScore = new Dictionary<string, int>();
            foreach (string playerName in namesOfAvailablePlayers)
            {
                currentPlayerScore.Add(playerName, 0);
            }

            // And create array for all pairs
            IDictionary<string, int> currentBuddyScore = new Dictionary<string, int>();
            foreach (string playerName1 in namesOfAvailablePlayers)
            {
                foreach (string playerName2 in namesOfAvailablePlayers)
                {
                    currentBuddyScore.Add(playerName1 + "<->" + playerName2, 0);
                }
            }

            foreach (Game game in gamesToLookAt)
            {

                string pair1_player1 = game.PlayerRed1;
                string pair1_player2 = game.PlayerRed2;
                string pair2_player1 = game.PlayerBlue1;
                string pair2_player2 = game.PlayerBlue2;

                int currentPointsScore = game.PointsAtStake;
                if (namesOfAvailablePlayers.Contains(pair1_player1) && pair1_player1 != null)
                {
                    currentPlayerScore.TryGetValue(pair1_player1, out int currentNumber);

                    int nextNumber = currentNumber + currentPointsScore;
                    currentPlayerScore.TryAdd(pair1_player1, nextNumber);
                }

                if (namesOfAvailablePlayers.Contains(pair1_player2) && pair1_player2 != null)
                {
                    currentPlayerScore.TryGetValue(pair1_player2, out int currentNumber);

                    int nextNumber = currentNumber + currentPointsScore;
                    currentPlayerScore.TryAdd(pair1_player2, nextNumber);
                }

                if (namesOfAvailablePlayers.Contains(pair2_player1) && pair2_player1 != null)
                {
                    currentPlayerScore.TryGetValue(pair2_player1, out int currentNumber);

                    int nextNumber = currentNumber + currentPointsScore;
                    currentPlayerScore.TryAdd(pair2_player1, nextNumber);

                }
                if (namesOfAvailablePlayers.Contains(pair2_player2) && pair2_player2 != null)
                {
                    currentPlayerScore.TryGetValue(pair2_player2, out int currentNumber);

                    int nextNumber = currentNumber + currentPointsScore;

                    currentPlayerScore.TryAdd(pair2_player2, nextNumber);
                }

                // Pair 1
                bool pair1ShallBeSaved = true;
                if (namesOfAvailablePlayers.Contains(pair1_player1))
                {
                    string pair1String = "";
                    if (pair1_player2 != null)
                    {
                        if (!namesOfAvailablePlayers.Contains(pair1_player2))
                        {
                            pair1ShallBeSaved = false;
                        }
                        else
                        {
                            pair1String = pair1_player1 + "<->" + pair1_player2;
                        }
                    }
                    else
                    {
                        pair1String = pair1_player1 + "<->" + pair1_player1;
                    }
                    if (pair1ShallBeSaved)
                    {
                        currentBuddyScore.TryGetValue(pair1String, out int currentNumberPair1);
                        int nextNumberPair1 = currentNumberPair1 + currentPointsScore;
                        currentBuddyScore.TryAdd(pair1String, nextNumberPair1);
                    }
                }

                // Pair 2
                bool pair2ShallBeSaved = true;
                if (namesOfAvailablePlayers.Contains(pair2_player1))
                {
                    string pair2String = "";
                    if (pair2_player2 != null)
                    {
                        if (!namesOfAvailablePlayers.Contains(pair2_player2))
                        {
                            pair2ShallBeSaved = false;
                        }
                        else
                        {
                            pair2String = pair2_player1 + "<->" + pair2_player2;
                        }
                    }
                    else
                    {
                        pair2String = pair2_player1 + "<->" + pair2_player1;
                    }
                    if (pair2ShallBeSaved)
                    {
                        currentBuddyScore.TryGetValue(pair2String, out int currentNumberPair2);
                        int nextNumberPair2 = currentNumberPair2 + currentPointsScore;
                        currentBuddyScore.TryAdd(pair2String, nextNumberPair2);
                    }
                }
            }

            var currentPlayerScoreSorted = currentPlayerScore.AsEnumerable().OrderBy(x => x.Value);

            // Så tager vi personer direkte over i puljen, så længe de alle kan være method
            List<string> certainPlayers = new List<string>();
            List<string> possiblePlayers = new List<string>();
            int previousNumber = -1;
            int currentCertainPlayers = 0;

            foreach (KeyValuePair<string, int> entry in currentPlayerScoreSorted)
            {
                int val = entry.Value;
                string key = entry.Key;
                if (currentCertainPlayers < maxPlayersNeeded)
                {
                    // Hvis denne værdi er anderledes end den sidste vi havde, ved vi at nogle spillere fra "possiblePlayers" kan bruges,
                    // fordi vi stadig mangler spillere
                    if (val > previousNumber)
                    {
                        if (possiblePlayers.Count + certainPlayers.Count <= maxPlayersNeeded)
                        {
                            // Så er det ok at flytte det direkte over
                            certainPlayers.AddRange(possiblePlayers);
                            currentCertainPlayers = certainPlayers.Count;

                            possiblePlayers = new List<string>();
                            previousNumber = val;
                            possiblePlayers.Add(key);
                        }
                        else
                        {
                            // Så har vi flere i possiblePlayers end der kan bruges
                            // Vi skal finde et antal af dem og smide over

                            Shuffle(possiblePlayers);
                            List<string> randomPlayers = new List<string>();
                            randomPlayers.AddRange(possiblePlayers.Take(maxPlayersNeeded - currentCertainPlayers));

                            certainPlayers.AddRange(randomPlayers);
                            currentCertainPlayers = certainPlayers.Count;

                        }
                    }
                    else
                    {
                        // Så var det samme nummer som før
                        possiblePlayers.Add(key);
                    }
                }
            }

            // Til sidst skal vi rydde op, hvis der er noget i possiblePlayers
            if (possiblePlayers.Count + certainPlayers.Count <= maxPlayersNeeded)
            {
                // Så er det ok at flytte det direkte over
                certainPlayers.AddRange(possiblePlayers);
                currentCertainPlayers = certainPlayers.Count;
            }
            else
            {
                // Så har vi flere i possiblePlayers end der kan bruges
                // Vi skal finde et antal af dem og smide over

                Shuffle(possiblePlayers);
                List<string> randomPlayers = new List<string>();
                randomPlayers.AddRange(possiblePlayers.Take(maxPlayersNeeded - currentCertainPlayers));
                certainPlayers.AddRange(randomPlayers);
                currentCertainPlayers = certainPlayers.Count;

            }

            // Let's make some great pairs
            int choosenNumberOfTries = 10;
            int triesSoFar = 0;
            int bestPairsFoundInRound = -1;
            int previousUniquenessScore = int.MaxValue;
            List<(string Player1, string Player2)> bestFoundPairs = null;

            for (triesSoFar = 0; triesSoFar < choosenNumberOfTries; triesSoFar++)
            {
                if (previousUniquenessScore == 0) break;
                // Shuffle them
                Shuffle(certainPlayers);

                int numberOfPlayers = certainPlayers.Count;
                int playersForLastTable = numberOfPlayers % 4;
                bool unevenNumberOfPlayers = ((numberOfPlayers % 2) == 1);

                int index = 0;
                (string Player1, string Player2) currentPair = (null, null);
                List<(string Player1, string Player2)> allPairs = new List<(string Player1, string Player2)>();
                foreach (string player in certainPlayers)
                {
                    if (index % 2 == 0)
                    {
                        // Then we have first player in Pair
                        currentPair = (null, null);
                        currentPair.Player1 = player;

                        // If the last table has 3 players, just add to allPairs now (we will not get to the else below ever)
                        if ((index + 1) == numberOfPlayers)
                        {
                            currentPair.Player2 = null;
                            allPairs.Add(currentPair);
                        }
                    }
                    else
                    {
                        if (index + 1 == numberOfPlayers && playersForLastTable == 2)
                        {
                            // Then we at the last person at the last game with two players
                            currentPair.Player2 = null;
                            allPairs.Add(currentPair);
                            currentPair = (null, null);
                            currentPair.Player1 = player;
                            currentPair.Player2 = null;
                            allPairs.Add(currentPair);
                        }
                        else
                        {
                            currentPair.Player2 = player;
                            allPairs.Add(currentPair);
                        }
                    }
                    index++;
                }

                // Udregn uniquenessScore
                int uniquenessScore = 0;
                foreach ((string Player1, string Player2) in allPairs)
                {
                    String comb1;
                    String comb2;
                    if (Player2 != null)
                    {
                        comb1 = Player1 + "<->" + Player2;
                        comb2 = Player2 + "<->" + Player1;
                    }
                    else
                    {
                        comb1 = Player1 + "<->" + Player1;
                        // On purpose - Matches alone is worth double (to avoid them given to the same player often)
                        comb2 = Player1 + "<->" + Player1;
                    }

                    currentBuddyScore.TryGetValue(comb1, out int currentScoreComb1);
                    uniquenessScore = uniquenessScore + currentScoreComb1;

                    currentBuddyScore.TryGetValue(comb2, out int currentScoreComb2);
                    uniquenessScore = uniquenessScore + currentScoreComb2;
                }

                if (uniquenessScore < previousUniquenessScore)
                {
                    previousUniquenessScore = uniquenessScore;
                    bestFoundPairs = allPairs;
                    bestPairsFoundInRound = triesSoFar;
                }
            }

            List<string> awesomePlayerList = new List<string>();

            foreach ((string Player1, string Player2) in bestFoundPairs)
            {
                awesomePlayerList.Add(Player1);
                awesomePlayerList.Add(Player2);
            }
            
            return awesomePlayerList;
        }

        private void Shuffle<T>(List<T> list)
        {
            Random r = new Random();
            int n = list.Count;
            while (n > 1)
            {
                n--;
                int k = r.Next(n + 1);
                T value = list[k];
                list[k] = list[n];
                list[n] = value;
            }
        }
    }
}