using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Interfaces;

namespace FordEvents.Model.FordEventsDB
{
    public partial class Notification : IDestroyable
    {
        public void Validate()
        {
            if (string.IsNullOrWhiteSpace(this.Message))
                throw new BusinessLogicException(ExceptionCodeEnum.FEATURE_NAME_REQUIRED);
        }

        public void Destroy()
        {
            this.Deleted = true;
        }

        public void MarkAsDelivered()
        {
            this.DeliveredDate = DateTime.Now;
        }
    }
}