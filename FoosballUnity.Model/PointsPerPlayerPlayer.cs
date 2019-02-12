using System;
using System.Collections.Generic;
using System.Text;

namespace FoosballUnity.Model
{
    public class PointsPerPlayerPlayer
    {
        public PointsPerPlayerPlayer(int position, int points, int numberOfGames, string name)
        {
            Position = position;
            Points = points;
            NumberOfGames = numberOfGames;
            Name = name;
        }

        public int Position { get; }
        public int Points { get; }
        public int NumberOfGames { get; }
        public string Name { get; }
    }
}
