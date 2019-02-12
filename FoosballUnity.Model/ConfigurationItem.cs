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

        public string Name { get; }
        public string Value { get; }
    }
}
