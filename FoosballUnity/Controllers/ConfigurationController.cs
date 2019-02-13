using FoosballUnity.Data;
using FoosballUnity.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FoosballUnity.Controllers
{
    [Route("api/configuration")]
    public class ConfigurationController : Controller
    {
        private readonly FoosballContext context;

        public ConfigurationController(FoosballContext context)
        {
            this.context = context;
        }

        [Route("")]
        [HttpGet]
        public async Task<ActionResult<ConfigurationItem[]>> Get()
        {
            var configurationItems = await context.Configurations.ToArrayAsync();

            return configurationItems;
        }
    }
}
