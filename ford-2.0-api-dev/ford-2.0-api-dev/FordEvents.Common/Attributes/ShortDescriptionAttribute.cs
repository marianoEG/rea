using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Attributes
{
    [System.AttributeUsage(System.AttributeTargets.All)]
    public class ShortDescriptionAttribute : System.Attribute
    {
        public string ShortDescription { get; set; }

        public ShortDescriptionAttribute(string text)
        {
            this.ShortDescription = text;
        }
    }
}
