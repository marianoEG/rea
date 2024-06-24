using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Utils
{
    public static class GlobalHelper
    {
        public static Guid? ToGuid(long? number)
        {
            if (!number.HasValue) return null;
            byte[] guidData = new byte[16];
            Array.Copy(BitConverter.GetBytes(number.Value), guidData, 8);
            return new Guid(guidData);
        }
    }
}
