using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Event
{
    public class GuestData : BaseData
    {
        public long? SubeventId { get; set; }
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
        public string State { get; set; }
        public string DataToScan { get; set; }
        public bool? ChangedByQrscanner { get; set; }
        public string PreferenceDate { get; set; }
        public string PreferenceHour { get; set; }
        public string PreferenceVehicle { get; set; }
    }
}