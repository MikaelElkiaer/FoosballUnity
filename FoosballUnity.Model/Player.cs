using System;
using System.Collections.Generic;
using System.Text;

namespace FoosballUnity.Model
{
    public class Player
    {
        public Player(string id, bool playerReady, DateTime createdUtc)
        {
            Id = id;
            PlayerReady = playerReady;
            CreatedUtc = createdUtc;
        }

        public string Id { get; private set; }
        public bool PlayerReady { get; private set; }
        public DateTime CreatedUtc { get; private set; }
    }
}
