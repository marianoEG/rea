using FordEvents.Common.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Utils
{
    public static class EnumHelper
    {
        public static UserProfileEnum? ToUserProfile(string profile)
        {
            if (string.IsNullOrEmpty(profile))
                return null;

            return Enum.TryParse<UserProfileEnum>(profile, true, out UserProfileEnum result) ? result : null;
        }

        public static bool VehicleTypeMatch(string type) 
        {
            bool test = Enum.TryParse<VehicleTypesEnum>(type, true, out VehicleTypesEnum result);
            return test;
        }

        public static bool GuestTypeMatch(string type)
        {
            bool test = Enum.TryParse<GuestTypesEnum>(type, true, out GuestTypesEnum result);
            return test;
        }

        public static bool GuestStateMatch(string type)
        {
            bool test = Enum.TryParse<GuestStatesEnum>(type, true, out GuestStatesEnum result);
            return test;
        }

        public static bool VersionCurrencyMatch(string currency)
        {
            bool test = Enum.TryParse<VersionCurrencyEnum>(currency, true, out VersionCurrencyEnum result);
            return test;
        }

        public static bool UserProfileMatch(string profile)
        {
            bool test = Enum.TryParse<UserProfileEnum>(profile, true, out UserProfileEnum result);
            return test;
        }
    }
}
