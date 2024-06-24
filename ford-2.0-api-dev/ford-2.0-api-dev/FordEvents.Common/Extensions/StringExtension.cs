
using System.Linq;
using System.Threading;

namespace System
{
    public static class StringExtension
    {
        public static decimal? AsDecimal(this string incomingValue)
        {
            if (string.IsNullOrWhiteSpace(incomingValue))
                return null;

            if (!incomingValue.Contains(',') && !incomingValue.Contains('.') && incomingValue.IsNumeric())
                return Decimal.Parse(incomingValue);

            decimal val;
            if (!decimal.TryParse(incomingValue.Replace(",", Thread.CurrentThread.CurrentCulture.NumberFormat.NumberDecimalSeparator).Replace(".", Thread.CurrentThread.CurrentCulture.NumberFormat.NumberDecimalSeparator), out val))
                return null;
            return val;
        }

        private static bool IsNumeric(this string text)
        {
            return text.All(char.IsDigit);
        }
    }
}
