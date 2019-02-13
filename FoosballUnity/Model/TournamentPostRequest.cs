using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FoosballUnity.Model
{
    public class TournamentPostRequest
    {
        public TournamentPostRequest(int numberOfGames, IEnumerable<Player> players)
        {
            NumberOfGames = numberOfGames;
            Players = players.ToArray();
        }

        public int NumberOfGames { get; }
        public Player[] Players { get; }
    }
}
