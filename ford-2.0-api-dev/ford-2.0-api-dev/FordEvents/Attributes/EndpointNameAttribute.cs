using FordEvents.Common.Enums;
using Microsoft.AspNetCore.Mvc;
using System;

namespace FordEvents.API.ActionFilters
{
    public class EndpointNameAttribute : Attribute
    {
        public SyncActionTypeEnum syncActionType { get; set; }
        public EndpointNameAttribute(SyncActionTypeEnum syncActionType)
        {
            this.syncActionType = syncActionType;
        }
    }
}
