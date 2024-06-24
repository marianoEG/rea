using FordEvents.Common.Data.Event;
using FordEvents.Common.Data.Sync;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Utils
{
    public static class CastHelper
    {
        public static GuestData CastGuestData(SyncGuestDeepData guest)
        {
            string state = "";
            switch (guest.State)
            {
                case "PRESENT":
                    state = "ASSISTED";
                    break;
                case "ABSENT":
                    state = "ABSENT";
                    break;
                case "ABSENT_WITH_NOTICE":
                    state = "ABSENT_NOTICE";
                    break;
            };
            return new GuestData()
            {
                Id = guest.Id,
                SubeventId = guest.SubeventId,
                Firstname = guest.Firstname,
                Lastname = guest.Lastname,
                DocumentNumber = guest.DocumentNumber,
                PhoneNumber = guest.PhoneNumber,
                Email = guest.Email,
                CarLicencePlate = guest.CarLicencePlate,
                Type = guest.Type,
                CompanionReference = guest.CompanionReference,
                Observations1 = guest.Observations1,
                Observations2 = guest.Observations2,
                Observations3 = guest.Observations3,
                Zone = guest.Zone,
                State = state,
                ChangedByQrscanner = guest.ChangedByQrscanner
            };
        }
    }
}
