using System;
using System.Collections.Generic;
using System.Text;

namespace FoosballUnity.Model
{
    public class TimerAction
    {
        public TimerAction(int id, DateTime lastRequestedTimerStartUtc)
        {
            Id = id;
            LastRequestedTimerStartUtc = lastRequestedTimerStartUtc;
        }

        public int Id { get; private set; }
        public DateTime LastRequestedTimerStartUtc { get; private set; }
    }
}
