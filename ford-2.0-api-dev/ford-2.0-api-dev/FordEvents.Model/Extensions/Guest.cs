using FordEvents.Common.Data.Province;
using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Interfaces;
using FordEvents.Common.Utils;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;

namespace FordEvents.Model.FordEventsDB
{
    public partial class Guest : IAuditable, IDestroyable
    {
        public void Validate()
        {
            if (string.IsNullOrWhiteSpace(this.Firstname))
                throw new BusinessLogicException(ExceptionCodeEnum.GUEST_FIRSTNAME_REQUIRED);

            if (string.IsNullOrWhiteSpace(this.Lastname))
                throw new BusinessLogicException(ExceptionCodeEnum.GUEST_LASTNAME_REQUIRED);

            if (string.IsNullOrWhiteSpace(this.Type))
            {
                throw new BusinessLogicException(ExceptionCodeEnum.GUEST_TYPE_REQUIRED);
            }
            else if (!EnumHelper.GuestTypeMatch(this.Type))
            {
                throw new BusinessLogicException(ExceptionCodeEnum.INVALID_GUEST_TYPE);
            }

            if (string.IsNullOrWhiteSpace(this.State))
            {
                throw new BusinessLogicException(ExceptionCodeEnum.GUEST_STATE_REQUIRED);
            }
            else if (!EnumHelper.GuestStateMatch(this.State))
            {
                throw new BusinessLogicException(ExceptionCodeEnum.INVALID_GUEST_STATE);
            }
        }

        public string GetDataToScan()
        {
            return GuestQREncryptionHelper.Encrypt(JsonConvert.SerializeObject(new
            {
                Id = this.Id,
                EventId = this.Subevent.EventId,
                SubeventId = this.SubeventId,
                Firstname = this.Firstname,
                Lastname = this.Lastname,
                DocumentNumber = this.DocumentNumber,
                Email = this.Email,
                PhoneNumber = this.PhoneNumber,
                PreferenceDate = this.PreferenceDate,
                PreferenceHour = this.PreferenceHour,
                PreferenceVehicle = this.PreferenceVehicle
            }));
        }

        public void Destroy()
        {
            this.Deleted = true;
        }
    }
}