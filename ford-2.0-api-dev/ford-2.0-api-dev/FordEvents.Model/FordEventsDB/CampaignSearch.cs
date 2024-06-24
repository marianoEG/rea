using System;
using System.Collections.Generic;

#nullable disable

namespace FordEvents.Model.FordEventsDB
{
    public partial class CampaignSearch
    {
        public long Id { get; set; }
        public long? EventId { get; set; }
        public string SearchText { get; set; }
        public DateTime? SearchDate { get; set; }
        public long? CampaignId { get; set; }
        public string Vin { get; set; }
        public string Cc { get; set; }
        public string Pat { get; set; }
        public string Serv { get; set; }
        public string ServDate { get; set; }
        public string Manten { get; set; }
        public DateTime? SyncDate { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime? CreatedOn { get; set; }
        public Guid? ModifiedBy { get; set; }
        public Guid? CreatedBy { get; set; }
        public bool Deleted { get; set; }

        public virtual Event Event { get; set; }
    }
}
