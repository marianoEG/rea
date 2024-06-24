using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Interfaces;
using FordEvents.Common.Data.Dealership;
using FordEvents.Common.Data.Province;
using System.Linq;

namespace FordEvents.Model.FordEventsDB
{
    public partial class Dealership : IAuditable, IDestroyable
    {
        public void Validate()
        {

            if (string.IsNullOrWhiteSpace(this.Name))
                throw new BusinessLogicException(ExceptionCodeEnum.DEALERSHIP_NAME_REQUIRED);
        }

        public void Destroy()
        {
            this.Deleted = true;
        }
    }
}
