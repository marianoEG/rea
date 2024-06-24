using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Model.FordEventsDB
{
    public partial class VehicleAccessory : IDestroyable
    {

        public void Validate()
        { 
            if (string.IsNullOrWhiteSpace(this.Name))
                throw new BusinessLogicException(ExceptionCodeEnum.VEHICLE_ACCESSORY_NAME_REQUIRED);
        }

        public void Destroy()
        {
            this.Deleted = true;
        }
    }
}
