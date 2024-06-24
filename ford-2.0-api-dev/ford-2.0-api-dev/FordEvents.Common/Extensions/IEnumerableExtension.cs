using FordEvents.Common;
using System.Linq;

namespace System.Collections.Generic
{
    public static class IEnumerableExtension
    {
        public static IEnumerable<T> Paginate<T>(this IEnumerable<T> list, int? pageNumber, int? pageSize)
        {
            int pageNumberSafe = pageNumber.HasValue ? pageNumber.Value : 1;
            int pageSizeSafe = pageSize.HasValue ? pageSize.Value : AppSettings.PageSizeByDefault;

            return list.Skip((pageNumberSafe - 1) * pageSizeSafe).Take(pageSizeSafe);
        }
    }
}
