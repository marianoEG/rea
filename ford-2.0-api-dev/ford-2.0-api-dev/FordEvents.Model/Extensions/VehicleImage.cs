using FordEvents.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Model.FordEventsDB
{
    public partial class VehicleImage : IDestroyable
    {
        public void Destroy()
        {
            this.Deleted = true;
        }
    }
}
