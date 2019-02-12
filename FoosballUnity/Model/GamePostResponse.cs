using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FoosballUnity.Model
{
    public class GamePostResponse
    {
        public GamePostResponse(IEnumerable<int> newGameIds)
        {
            NewGameIds = newGameIds.ToArray();
        }

        public int[] NewGameIds { get; }
    }
}
