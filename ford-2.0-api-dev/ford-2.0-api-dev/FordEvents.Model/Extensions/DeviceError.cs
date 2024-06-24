using FordEvents.Common.Interfaces;
using System;
using System.Collections.Generic;

#nullable disable

namespace FordEvents.Model.FordEventsDB
{
    public partial class DeviceError : IAuditable, IDestroyable
    {

        public void Destroy()
        {
            this.Deleted = true;
        }

    }
}
