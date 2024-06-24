using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Form
{
    public class NewsletterFormData : BaseData
    {
        public long EventId { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string VehicleOfInterest { get; set; }
        public bool RecieveInformation { get; set; }
        public bool AcceptConditions { get; set; }

    }
}