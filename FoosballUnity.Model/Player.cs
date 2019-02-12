using System;
using System.Collections.Generic;
using System.Text;

namespace FoosballUnity.Model
{
    public class Player
    {
        public Player(string name, bool playerReady, DateTime createdUtc, string registeredRfidTag)
        {
            Name = name;
            PlayerReady = playerReady;
            CreatedUtc = createdUtc;
            RegisteredRfidTag = registeredRfidTag;
        }

        public string Name { get; private set; }
        public bool PlayerReady { get; private set; }
        public DateTime CreatedUtc { get; private set; }
        public string RegisteredRfidTag { get; private set; }
    }
}
