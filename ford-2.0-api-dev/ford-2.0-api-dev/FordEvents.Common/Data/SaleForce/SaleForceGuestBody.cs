using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.SaleForce
{
    public class SaleForceGuestBody
    {
        public SaleForceGuestKeysBody keys { get; set; }
        public SaleForceGuestValuesBody values { get; set; }
}

    public class SaleForceGuestKeysBody
    {
        public string ID { get; set; }
    }

    public class SaleForceGuestValuesBody
    {
        public string SubeventID { get; set; }
        public string SubeventName { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string DocumentNumber { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string CarLicencePlate { get; set; }
        public string Type { get; set; }
        public string CompanionReference { get; set; }
        public string Observations1 { get; set; }
        public string Observations2 { get; set; }
        public string Observations3 { get; set; }
        public string Zone { get; set; }
        public string state { get; set; }
        public string ChangedByQRScanner { get; set; }
        public string QrUrl { get; set; }
        public string FechaIngreso { get; set; }

    }
}