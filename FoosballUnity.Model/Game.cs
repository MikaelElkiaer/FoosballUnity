using System;
using System.Collections.Generic;
using System.Text;

namespace FoosballUnity.Model
{
    public class Game
    {
        public Game(int id, string playerRed1, string playerRed2, string playerBlue1, string playerBlue2, DateTime lastUpdatedUtc, string matchWinner, int winningTable, int pointsAtStake)
        {
            Id = id;
            PlayerRed1 = playerRed1;
            PlayerRed2 = playerRed2;
            PlayerBlue1 = playerBlue1;
            PlayerBlue2 = playerBlue2;
            LastUpdatedUtc = lastUpdatedUtc;
            MatchWinner = matchWinner;
            WinningTable = winningTable;
            PointsAtStake = pointsAtStake;
        }

        public int Id { get; private set; }
        public string PlayerRed1 { get; private set; }
        public string PlayerRed2 { get; private set; }
        public string PlayerBlue1 { get; private set; }
        public string PlayerBlue2 { get; private set; }
        public DateTime LastUpdatedUtc { get; private set; }
        public string MatchWinner { get; private set; }
        public int WinningTable { get; private set; }
        public int PointsAtStake { get; private set; }
    }
}
