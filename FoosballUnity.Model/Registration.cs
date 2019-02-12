using System;
using System.Collections.Generic;
using System.Text;

namespace FoosballUnity.Model
{
    public class Registration
    {
        public Registration(string rfidTag)
        {
            RfidTag = rfidTag;
        }

        public string RfidTag { get; }
    }
}
