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

        public int Position { get; private set; }
        public int Points { get; private set; }
        public int NumberOfGames { get; private set; }
        public string Name { get; private set; }
    }
}
