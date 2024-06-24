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
    public partial class FeatureVersion : IDestroyable
    {
        public void Validate()
        {
            if (string.IsNullOrWhiteSpace(this.Value))
                throw new BusinessLogicException(ExceptionCodeEnum.FEATURE_VERSION_VALUE_REQUIRED);
        }

        public void Destroy()
        {
            this.Deleted = true;
        }
    }
}