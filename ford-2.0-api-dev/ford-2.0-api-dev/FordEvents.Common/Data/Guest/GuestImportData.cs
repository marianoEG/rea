using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Guest
{
    public class GuestImportData
    {
        public long? EventId { get; set; }
        public long? SubeventId { get; set; }
        public byte[] FileData { get; set; }
    }
}
