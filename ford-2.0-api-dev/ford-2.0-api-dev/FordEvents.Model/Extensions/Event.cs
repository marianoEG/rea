using FordEvents.Common.Data;
using FordEvents.Common.Data.Event;
using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Model.FordEventsDB
{
    public partial class Event : IAuditable, IDestroyable
    {
        public void Validate()
        {
            if (string.IsNullOrWhiteSpace(this.Code))
                throw new BusinessLogicException(ExceptionCodeEnum.EVENT_CODE_REQUIRED);
            if (string.IsNullOrWhiteSpace(this.Name))
                throw new BusinessLogicException(ExceptionCodeEnum.EVENT_NAME_REQUIRED);
        }

        public void Destroy()
        {
            this.Deleted = true;
        }

        #region SubEvents

        public List<SubEvent> GetSubEvents()
        {
            return this.SubEvents.Where(x => !x.Deleted).ToList();
        }

        public PagedList<SubEvent> GetSubEvents(int? pageNumber, int? pageSize, string searchText)
        {
            string filter = string.IsNullOrWhiteSpace(searchText) ? "" : searchText.Trim().ToLower();
            IQueryable<SubEvent> query = FEContext.CurrentContext.SubEvents
                .Where(x =>
                    x.EventId == this.Id
                    &&
                    !x.Deleted
                    &&
                    (x.Name.ToLower().Contains(filter))
                )
                .OrderBy(x => x.Name);

            PagedList<SubEvent> result = new PagedList<SubEvent>();
            result.ListOfEntities = query.Paginate(pageNumber, pageSize).ToList();
            result.CurrentPage = pageNumber;
            result.PageSize = pageSize;
            result.TotalItems = query.Count();
            return result;
        }

        public SubEvent GetSubEvent(long? subeventId)
        {
            SubEvent subevent = FEContext.CurrentContext.SubEvents.Where(x => x.EventId == this.Id && x.Id == subeventId && !x.Deleted).SingleOrDefault();
            if (subevent == null)
                throw new BusinessLogicException(ExceptionCodeEnum.SUBEVENT_NOT_FOUND);
            return subevent;
        }

        

        public SubEvent CreateSubEvent(SubEventData data)
        {
            SubEvent subevent = new SubEvent();
            subevent.Event = this;
            subevent.Name = data.Name;
            subevent.DateFrom = data.DateFrom;
            subevent.DateTo = data.DateTo;
            subevent.Image = data.Image;
            subevent.Enable = data.Enable.AsBool();
            subevent.GuestNumber = data.GuestNumber;
            subevent.Validate();
            FEContext.CurrentContext.SubEvents.Add(subevent);
            return subevent;
        }

        public SubEvent EditSubEvent(SubEventData data)
        {
            SubEvent subevent = this.GetSubEvent(data.Id);
            subevent.Name = data.Name;
            subevent.DateFrom = data.DateFrom;
            subevent.DateTo = data.DateTo;
            subevent.Image = data.Image;
            subevent.Enable = data.Enable.AsBool();

            if (subevent.GuestNumber > data.GuestNumber)
                throw new BusinessLogicException(ExceptionCodeEnum.SUBEVENT_GUEST_NUMBER_MINOR);

            subevent.GuestNumber = data.GuestNumber;
            subevent.Validate();
            return subevent;
        }

        public void AddFormsCount(long? testDriveCount, long? testDriveQRCount)
        {
            this.TestDriveFormsCount = (this.TestDriveFormsCount ?? 0) + (testDriveCount ?? 0);
            this.TestDriveFormsQrcount = (this.TestDriveFormsQrcount ?? 0) + (testDriveQRCount ?? 0);
        }

        public void DeleteSubEvent(long? subeventId)
        {
            this.GetSubEvent(subeventId).Destroy();
        }

        #endregion
    }
}
