using System;
using System.Collections.Generic;

#nullable disable

namespace FordEvents.Model.FordEventsDB
{
    public partial class Guest
    {
        public long Id { get; set; }
        public long SubeventId { get; set; }
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
        public bool? ChangedByQrscanner { get; set; }
        public string PreferenceDate { get; set; }
        public string PreferenceHour { get; set; }
        public string PreferenceVehicle { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime? CreatedOn { get; set; }
        public Guid? ModifiedBy { get; set; }
        public Guid? CreatedBy { get; set; }
        public bool Deleted { get; set; }

        public virtual SubEvent Subevent { get; set; }
    }
}
