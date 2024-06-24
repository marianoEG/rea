using FordEvents.ApiClientInvoker;
using FordEvents.Common.Data;
using FordEvents.Common.Data.Event;
using FordEvents.Common.Data.Guest;
using FordEvents.Common.Data.SaleForce;
using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Services;
using FordEvents.Common.Utils;
using FordEvents.Model.FordEventsDB;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Services
{
    public class GuestServices : BaseServices
    {
        private SaleForceApiInvoker _saleForceApiInvoker;

        public GuestServices(CurrentUserService currentUserService, SaleForceApiInvoker saleForceApiInvoker) : base(currentUserService) {
            _saleForceApiInvoker = saleForceApiInvoker;
        }

        public PagedList<GuestData> GetGuestsList(int? pageNumber, int? pageSize, long eventId, long? subEventId, string searchText, bool? changedByQrscanner)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin() && !_currentUserService.IsReadOnly())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Event _event = context.GetEventById(eventId);
                SubEvent _subevent = _event.GetSubEvent(subEventId);

                PagedList<Guest> subEventPage = _subevent.GetGuests(pageNumber, pageSize, searchText, changedByQrscanner);

                PagedList<GuestData> result = new PagedList<GuestData>();
                result.ListOfEntities = subEventPage.ListOfEntities.ToList<object>().ToDataList<GuestData>();
                result.CurrentPage = pageNumber;
                result.PageSize = pageSize;
                result.TotalItems = subEventPage.TotalItems;
                return result;
            }
        }

        public GuestData GetGuest(long eventId, long subeventId, long guestId)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin() && !_currentUserService.IsReadOnly())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Event _event = context.GetEventById(eventId);
                SubEvent subevent = _event.GetSubEvent(subeventId);

                return subevent.GetGuest(guestId).ToData<GuestData>();
            }
        }

        public GuestData CreateGuest(long eventId, GuestData guest)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Event _event = context.GetEventById(eventId);
                SubEvent _subevent = _event.GetSubEvent(guest.SubeventId);

                if (_subevent.IsFull())
                    throw new BusinessLogicException(ExceptionCodeEnum.SUBEVENT_IS_FULL);

                Guest newGuest = _subevent.CreateGuest(guest, false);

                context.SaveChanges();
                return newGuest.ToData<GuestData>();
            }
        }

        public GuestData EditGuest(long eventId, GuestData guest)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Event _event = context.GetEventById(eventId);
                SubEvent _subevent = _event.GetSubEvent(guest.SubeventId);
                Guest newGuest = _subevent.EditGuest(guest, false, false);

                context.SaveChanges();
                return newGuest.ToData<GuestData>();
            }
        }

        public void DeleteGuest(long eventId, long subeventId, long guestId)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Event _event = context.GetEventById(eventId);
                SubEvent subevent = _event.GetSubEvent(subeventId);

                subevent.DeleteGuest(guestId);
                context.SaveChanges();
            }
        }

        public void DeleteGuests(long eventId, long subeventId)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Event _event = context.GetEventById(eventId);
                SubEvent subevent = _event.GetSubEvent(subeventId);

                subevent.DeleteGuests();
                context.SaveChanges();
            }
        }

        public void ImportGuestList(IFormCollection data)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                long? eventId = null;
                if (data.TryGetValue("eventId", out var stringEventId))
                {
                    eventId = Convert.ToInt64(stringEventId);
                };

                long? subeventId = null;
                if (data.TryGetValue("subeventId", out var stringSubeventId))
                {
                    subeventId = Convert.ToInt64(stringSubeventId);
                };

                Event _event = context.GetEventById(eventId);
                SubEvent subevent = _event.GetSubEvent(subeventId);

                using (MemoryStream memStream = new MemoryStream())
                {
                    data.Files[0].CopyTo(memStream);

                    ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                    ExcelPackage excelPackage = new ExcelPackage(memStream);

                    //Get a WorkSheet by index. Note that EPPlus indexes are base 1, not base 0!
                    ExcelWorksheet firstWorksheet = excelPackage.Workbook.Worksheets[0];

                    //if (firstWorksheet == null)
                    //    throw new BusinessLogicException("Formato incorrecto, el excel parece que no tiene ninguna hoja?");

                    var start = firstWorksheet.Dimension.Start;
                    var end = firstWorksheet.Dimension.End;

                    // La primer fila se considera que es de títulos y por eso le suma 1
                    for (int row = start.Row + 1; row <= end.Row; row++)
                    { // Row by row...

                        try
                        {
                            if (subevent.IsFull())
                                throw new BusinessLogicException(ExceptionCodeEnum.SUBEVENT_IS_FULL);

                            GuestData guestData = new GuestData();

                            guestData.DocumentNumber = firstWorksheet.Cells[row, 1].Value?.ToString();
                            guestData.Firstname = firstWorksheet.Cells[row, 2].Value?.ToString();
                            guestData.Lastname = firstWorksheet.Cells[row, 3].Value?.ToString();
                            guestData.Email = firstWorksheet.Cells[row, 4].Value?.ToString();
                            guestData.PhoneNumber = firstWorksheet.Cells[row, 5].Value?.ToString();
                            guestData.State = firstWorksheet.Cells[row, 6].Value?.ToString();
                            guestData.Type = firstWorksheet.Cells[row, 7].Value?.ToString();
                            guestData.CarLicencePlate = firstWorksheet.Cells[row, 8].Value?.ToString();
                            guestData.CompanionReference = firstWorksheet.Cells[row, 9].Value?.ToString();
                            guestData.Zone = firstWorksheet.Cells[row, 10].Value?.ToString();
                            guestData.Observations1 = firstWorksheet.Cells[row, 11].Value?.ToString();
                            guestData.Observations2 = firstWorksheet.Cells[row, 12].Value?.ToString();
                            guestData.Observations3 = firstWorksheet.Cells[row, 13].Value?.ToString();
                            guestData.PreferenceDate = firstWorksheet.Cells[row, 14].Value?.ToString();
                            guestData.PreferenceHour = firstWorksheet.Cells[row, 15].Value?.ToString();
                            guestData.PreferenceVehicle = firstWorksheet.Cells[row, 16].Value?.ToString();

                            if (subevent.HasGuest(guestData.DocumentNumber))
                                subevent.EditGuest(guestData, true, false);
                            else
                                subevent.CreateGuest(guestData, false);
                        }
                        catch (BusinessLogicException)
                        {
                            throw;
                        }
                        catch (Exception ex)
                        {
                            throw new BusinessLogicException(ExceptionCodeEnum.UNHANDLE_ERROR, "Posición " + row + ": " + ex.Message);
                        }
                    }

                    //Save your file
                    excelPackage.Save();
                }

                context.SaveChanges();
            }
        }

        public Bitmap getQRData(long? guestId)
        {
            using (var context = this.GetCurrentContext())
            {
                Guest guest = context.GetGuestByIdOrDefault(guestId);
                
                if (guest == null)
                    return null;

                return QRHelper.GenerateQRCode(guest.GetDataToScan());
            }
        }

        public void syncToSaleForce(long? eventId, long? subeventId, SyncToSaleForceData data)
        {
            using(var context = this.GetCurrentContext())
            {
                Event _event = context.GetEventById(eventId);
                SubEvent subEvent = _event.GetSubEvent(subeventId);
                List<SaleForceGuestBody> guests = subEvent.GetGuests().ToList<object>().ToDataList<SaleForceGuestBody>();
                foreach(SaleForceGuestBody guest in guests)
                {
                    guest.values.FechaIngreso = data.FechaIngreso;
                }
                _saleForceApiInvoker.SyncGuests(guests);
            }
        }

    }
}
