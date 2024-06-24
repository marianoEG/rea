using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Model.FordEventsDB
{
    public partial class Campaign
    {
        public void Validate()
        {

        }

        public void Destroy()
        {
            this.Deleted = true;
        }
    }
}
