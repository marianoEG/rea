using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Interfaces;
using System.Linq;

namespace FordEvents.Model.FordEventsDB
{
    public partial class CampaignSearch : IAuditable, IDestroyable
    {
        public void Validate()
        {

        }

        public void Destroy()
        {
            this.Deleted = true;
        }
    }
}
