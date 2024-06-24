using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Interfaces;
using System.Linq;

namespace FordEvents.Model.FordEventsDB
{
    public partial class Configuration : IAuditable, IDestroyable
    {
        public void Validate()
        {

            if (string.IsNullOrWhiteSpace(this.Key))
                throw new BusinessLogicException(ExceptionCodeEnum.CONFIGURATION_KEY_REQUIRED);

            if (string.IsNullOrWhiteSpace(this.Value))
                throw new BusinessLogicException(ExceptionCodeEnum.CONFIGURATION_VALUE_REQUIRED);

            if (this.HasConfiguration(this.Key))
                throw new BusinessLogicException(ExceptionCodeEnum.CONFIGURATION_EXISTS);
        }

        public bool HasConfiguration(string key)
        {
            return FEContext.CurrentContext.Configurations
                .Any(x =>
                    x.Key == key
                    &&
                    !x.Deleted
                    &&
                    x.Id != this.Id
                );
        }

        public void Destroy()
        {
            this.Deleted = true;
        }

    }
}