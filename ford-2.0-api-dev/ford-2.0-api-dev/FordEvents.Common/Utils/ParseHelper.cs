using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Utils
{
    public static class ParseHelper
    {
        public static long? ParseLong(string number)
        {
            if (string.IsNullOrEmpty(number))
                return null;

            return long.TryParse(number, out long result) ? result : null;
        }

        public static decimal? ParseDecimal(string decim)
        {
            if (string.IsNullOrEmpty(decim))
                return null;

            return decimal.TryParse(decim, NumberStyles.Number, CultureInfo.InvariantCulture, out decimal result) ? result : null;
        }

        public static DateTime? ParseDateTime(string dateTime)
        {
            if (string.IsNullOrEmpty(dateTime))
                return null;

            return DateTime.TryParse(dateTime, out DateTime result) ? result : null;
        }

        public static Uri ParseUri(string uri)
        {
            if (string.IsNullOrEmpty(uri))
                return null;

            return Uri.TryCreate(uri, UriKind.Absolute, out Uri result)
                && (result.Scheme == Uri.UriSchemeHttp || result.Scheme == Uri.UriSchemeHttps) ? result : null;
        }
    }
}
