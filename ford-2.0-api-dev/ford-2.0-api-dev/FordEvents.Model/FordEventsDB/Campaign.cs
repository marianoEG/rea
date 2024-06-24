using System;
using System.Collections.Generic;

#nullable disable

namespace FordEvents.Model.FordEventsDB
{
    public partial class Campaign
    {
        public long Id { get; set; }
        public long? CampaignId { get; set; }
        public string Env { get; set; }
        public string Vin { get; set; }
        public string Cc { get; set; }
        public string Pat { get; set; }
        public string Serv { get; set; }
        public DateTime? ServDate { get; set; }
        public string Manten { get; set; }
        public string Recall1 { get; set; }
        public string Recall2 { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime? CreatedOn { get; set; }
        public Guid? ModifiedBy { get; set; }
        public Guid? CreatedBy { get; set; }
        public bool Deleted { get; set; }
    }
}
