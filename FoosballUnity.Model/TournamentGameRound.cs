using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace FoosballUnity.Model
{
    public class TournamentGameRound
    {
        public TournamentGameRound(IEnumerable<Game> tournamentGames)
        {
            TournamentGames = tournamentGames.ToArray();
        }

        public Game[] TournamentGames { get; private set; }
    }
}
