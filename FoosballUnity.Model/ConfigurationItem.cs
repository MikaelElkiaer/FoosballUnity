using System;

namespace FoosballUnity.Model
{
    public class ConfigurationItem
    {
        public ConfigurationItem(string name, string value)
        {
            Name = name;
            Value = value;
        }

        public string Name { get; private set; }
        public string Value { get; private set; }
    }
}
