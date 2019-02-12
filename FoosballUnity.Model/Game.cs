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
            LastUpdated = lastUpdatedUtc;
            MatchWinner = matchWinner;
            WinningTable = winningTable;
            PointsAtStake = pointsAtStake;
        }

        public int Id { get; }
        public string PlayerRed1 { get; }
        public string PlayerRed2 { get; }
        public string PlayerBlue1 { get; }
        public string PlayerBlue2 { get; }
        public DateTime LastUpdated { get; }
        public string MatchWinner { get; }
        public int WinningTable { get; }
        public int PointsAtStake { get; }
    }
}
