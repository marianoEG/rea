using FordEvents.Common.Data;
using FordEvents.Common.Data.Event;
using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace FordEvents.Model.FordEventsDB
{
    public partial class SubEvent : IAuditable, IDestroyable
    {
        public void Validate()
        {

            if (string.IsNullOrWhiteSpace(this.Name))
                throw new BusinessLogicException(ExceptionCodeEnum.SUBEVENT_NAME_REQUIRED);
        }

        #region

        public Guest CreateGuest(GuestData guest, bool isSync)
        {
            if (!isSync && this.IsFull())
                throw new BusinessLogicException(ExceptionCodeEnum.SUBEVENT_IS_FULL);

            Guest _newGuest = new Guest();
            _newGuest.Firstname = guest.Firstname;
            _newGuest.Lastname = guest.Lastname;
            _newGuest.Subevent = this;
            _newGuest.DocumentNumber = guest.DocumentNumber;
            _newGuest.PhoneNumber = guest.PhoneNumber;
            _newGuest.CarLicencePlate = guest.CarLicencePlate;
            _newGuest.CompanionReference = guest.CompanionReference;
            _newGuest.Zone = guest.Zone;
            _newGuest.Observations1 = guest.Observations1;
            _newGuest.Observations2 = guest.Observations2;
            _newGuest.Observations3 = guest.Observations3;
            _newGuest.Type = guest.Type;
            _newGuest.Email = guest.Email;
            _newGuest.PreferenceDate = guest.PreferenceDate;
            _newGuest.PreferenceHour = guest.PreferenceHour;
            _newGuest.PreferenceVehicle = guest.PreferenceVehicle;

            if (guest.State != null)
            {
                _newGuest.State = guest.State;
            }
            else
                _newGuest.State = GuestStatesEnum.ABSENT.ToString();

            if (isSync)
                _newGuest.ChangedByQrscanner = guest.ChangedByQrscanner;


            _newGuest.Validate();
            this.Guests.Add(_newGuest);
            FEContext.CurrentContext.Guests.Add(_newGuest);

            return _newGuest;
        }

        public Guest EditGuest(GuestData guest, bool importing, bool isSync)
        {
            Guest _currentGuest = null;
            if (importing == false)
            {
                _currentGuest = this.GetGuest(guest.Id);
            }
            else
                _currentGuest = this.GetGuest(guest.DocumentNumber);

            _currentGuest.Firstname = guest.Firstname;
            _currentGuest.Lastname = guest.Lastname;
            _currentGuest.Subevent = this;
            _currentGuest.DocumentNumber = guest.DocumentNumber;
            _currentGuest.PhoneNumber = guest.PhoneNumber;
            _currentGuest.CarLicencePlate = guest.CarLicencePlate;
            _currentGuest.CompanionReference = guest.CompanionReference;
            _currentGuest.Zone = guest.Zone;
            _currentGuest.Observations1 = guest.Observations1;
            _currentGuest.Observations2 = guest.Observations2;
            _currentGuest.Observations3 = guest.Observations3;
            _currentGuest.Type = guest.Type;
            _currentGuest.Email = guest.Email;
            _currentGuest.State = guest.State;
            _currentGuest.PreferenceDate = guest.PreferenceDate;
            _currentGuest.PreferenceHour = guest.PreferenceHour;
            _currentGuest.PreferenceVehicle = guest.PreferenceVehicle;

            if (isSync)
                _currentGuest.ChangedByQrscanner = guest.ChangedByQrscanner;

            _currentGuest.Validate();

            return _currentGuest;
        }

        public Guest GetGuest(long? guestId)
        {
            Guest guest = FEContext.CurrentContext.Guests.Where(x => x.SubeventId == this.Id && x.Id == guestId && !x.Deleted).SingleOrDefault();
            if (guest == null)
                throw new BusinessLogicException(ExceptionCodeEnum.GUEST_NOT_FOUND);
            return guest;
        }

        public Guest GetGuest(string documentNumber)
        {
            Guest guest = FEContext.CurrentContext.Guests.Where(x => x.SubeventId == this.Id && x.DocumentNumber == documentNumber && !x.Deleted).SingleOrDefault();
            if (guest == null)
                throw new BusinessLogicException(ExceptionCodeEnum.GUEST_NOT_FOUND);
            return guest;
        }

        public PagedList<Guest> GetGuests(int? pageNumber, int? pageSize, string searchText, bool? changedByQrscanner)
        {
            string filter = string.IsNullOrWhiteSpace(searchText) ? "" : searchText.Trim().ToLower();
            IQueryable<Guest> query = FEContext.CurrentContext.Guests
                .Where(x =>
                    x.SubeventId == this.Id
                    &&
                    !x.Deleted
                    &&
                    (
                        x.Firstname.ToLower().Contains(filter) || x.Lastname.ToLower().Contains(filter)
                    )
                    &&
                    (
                        !changedByQrscanner.HasValue
                        ||
                        ( changedByQrscanner == true && x.ChangedByQrscanner == true )
                        ||
                        ( changedByQrscanner == false && x.ChangedByQrscanner != true )
                    )
                )
                .OrderBy(x => x.Lastname).ThenBy(x => x.Firstname);

            PagedList<Guest> result = new PagedList<Guest>();
            result.ListOfEntities = query.Paginate(pageNumber, pageSize).ToList();
            result.CurrentPage = pageNumber;
            result.PageSize = pageSize;
            result.TotalItems = query.Count();
            return result;
        }

        public void DeleteGuest(long guestId)
        {
            this.GetGuest(guestId).Destroy();
        }

        public void DeleteGuests()
        {
            foreach(var guest in this.GetGuests())
            {
                guest.Destroy();
            }
        }

        public List<Guest> GetGuests()
        {
            return this.Guests.Where(x => !x.Deleted).ToList();
        }

        public int GetGuestsCount()
        {
            return this.GetGuests().Count();
        }

        public bool IsFull()
        {
            if (this.GuestNumber == null)
                return false;
            else
                return this.GetGuestsCount() >= this.GuestNumber;
        }

        #endregion

        public void Destroy()
        {
            this.Deleted = true;
        }

        public bool HasGuest(string documentNumber)
        {
            return FEContext.CurrentContext.Guests
                .Any(x =>
                    x.SubeventId == this.Id
                    &&
                    x.DocumentNumber == documentNumber
                    &&
                    !x.Deleted
                );
        }
    }
}
