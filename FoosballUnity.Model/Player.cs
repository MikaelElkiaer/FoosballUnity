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

        public string Name { get; }
        public bool PlayerReady { get; }
        public DateTime CreatedUtc { get; }
        public string RegisteredRfidTag { get; }
    }
}
