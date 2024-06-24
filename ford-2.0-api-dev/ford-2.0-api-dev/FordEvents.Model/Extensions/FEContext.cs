using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Services;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Model.FordEventsDB
{
    public partial class FEContext : DbContext
    {
        #region Properties
        public static string connectionString;
        private CurrentUserService _currentUserService;

        [ThreadStatic]
        private static FEContext _instance;

        public static FEContext CurrentContext
        {
            get
            {
                return FEContext._instance;
            }
        }
        #endregion

        public static FEContext GetInstance(CurrentUserService currentUserService)
        {
            if (FEContext._instance == null)
            {
                // Instancio el Contexto
                var contextOptions = new DbContextOptionsBuilder<FEContext>()
                .UseLazyLoadingProxies(true)
                .UseSqlServer(connectionString)
                .Options;
                FEContext._instance = new FEContext(contextOptions);
                FEContext._instance._currentUserService = currentUserService;
            }
            return FEContext._instance;
        }

        #region Audit
        public override int SaveChanges()
        {
            this.SetAuditData();
            return base.SaveChanges();
        }

        private void SetAuditData()
        {
            DateTime? timestamp = DateTime.UtcNow;

            foreach (object entity in this.GetChangedEntities(EntityState.Added))
            {
                // Set CreatedOn by reflection
                PropertyInfo propertyInfo1 = entity.GetType().GetProperty("CreatedOn");
                if (propertyInfo1 != null)
                    propertyInfo1.SetValue(entity, timestamp, null);

                // Set CreatedBy by reflection
                PropertyInfo propertyInfo2 = entity.GetType().GetProperty("CreatedBy");
                if (propertyInfo2 != null)
                    propertyInfo2.SetValue(entity, this._currentUserService?.GetUserId(), null);

                // Set ModifiedOn by reflection
                PropertyInfo propertyInfo3 = entity.GetType().GetProperty("ModifiedOn");
                if (propertyInfo3 != null)
                    propertyInfo3.SetValue(entity, timestamp, null);

                // Set ModifiedBy by reflection
                PropertyInfo propertyInfo4 = entity.GetType().GetProperty("ModifiedBy");
                if (propertyInfo4 != null)
                    propertyInfo4.SetValue(entity, this._currentUserService?.GetUserId(), null);

                // Set Deleted by reflection
                PropertyInfo propertyInfo5 = entity.GetType().GetProperty("Deleted");
                if (propertyInfo5 != null)
                    propertyInfo5.SetValue(entity, false, null);
            }

            foreach (object entity in this.GetChangedEntities(EntityState.Modified))
            {
                // Set ModifiedOn by reflection
                PropertyInfo propertyInfo3 = entity.GetType().GetProperty("ModifiedOn");
                if (propertyInfo3 != null)
                    propertyInfo3.SetValue(entity, timestamp, null);

                // Set ModifiedBy by reflection
                PropertyInfo propertyInfo4 = entity.GetType().GetProperty("ModifiedBy");
                if (propertyInfo4 != null)
                    propertyInfo4.SetValue(entity, this._currentUserService?.GetUserId(), null);
            }
        }

        private List<object> GetChangedEntities(EntityState pEntityState)
        {
            return (from J in this.ChangeTracker.Entries()
                    where pEntityState == J.State
                    select J.Entity).ToList();
        }
        #endregion

        public override void Dispose()
        {
            base.Dispose();
            FEContext._instance = null;
        }
        public User GetUserOrDefaultByEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return null;
            return FEContext.CurrentContext.Users.SingleOrDefault(user => user.Email.ToLower() == email.ToLower() && !user.Deleted);
        }

        public User GetUserById(Guid? userId)
        {
            User user = FEContext.CurrentContext.Users.SingleOrDefault(c => c.Id == userId && !c.Deleted);
            if (user == null)
                throw new BusinessLogicException(ExceptionCodeEnum.USER_NOT_FOUND);
            return user;
        }

        public User GetUserByEmail(string email)
        {
            User user = FEContext.CurrentContext.Users.SingleOrDefault(c => c.Email == email && !c.Deleted);
            if (user == null)
                throw new BusinessLogicException(ExceptionCodeEnum.USER_NOT_FOUND);
            return user;
        }

        public Event GetEventById(long? eventId)
        {
            Event _event = FEContext.CurrentContext.Events.SingleOrDefault(c => c.Id == eventId && !c.Deleted);
            if (_event == null)
                throw new BusinessLogicException(ExceptionCodeEnum.EVENT_NOT_FOUND, "EventID: " + eventId);
            return _event;
        }

        public Event GetEventByIdOrDefault(long? eventId)
        {
            return FEContext.CurrentContext.Events.SingleOrDefault(c => c.Id == eventId && !c.Deleted);
        }

        public SubEvent GetSubEventByIdOrDefault(long? subeventId)
        {
            return FEContext.CurrentContext.SubEvents.SingleOrDefault(x => x.Id == subeventId);
        }

        public Campaign GetCampaignById(long? campaignId)
        {
            Campaign _campaign = FEContext.CurrentContext.Campaigns.SingleOrDefault(c => c.Id == campaignId && !c.Deleted);
            if (_campaign == null)
                throw new BusinessLogicException(ExceptionCodeEnum.CAMPAIGN_NOT_FOUND, "CampaignID: " + campaignId);
            return _campaign;
        }

        /// <summary>
        /// Es igual al GetEventById pero retorna el evento aunque el mismo ya esté borrado
        /// </summary>
        /// <param name="eventId"></param>
        /// <returns></returns>
        public Event GetEventToSync(long? eventId)
        {
            return FEContext.CurrentContext.Events.SingleOrDefault(c => c.Id == eventId);
        }

        public Vehicle GetVehicleById(long? vehicleId)
        {
            Vehicle _vehicle = FEContext.CurrentContext.Vehicles.SingleOrDefault(c => c.Id == vehicleId && !c.Deleted);
            if (_vehicle == null)
                throw new BusinessLogicException(ExceptionCodeEnum.VEHICLE_NOT_FOUND);
            return _vehicle;
        }

        public Version GetVersionById(long? versionId)
        {
            Version _version = FEContext.CurrentContext.Versions.SingleOrDefault(c => c.Id == versionId && !c.Deleted);
            if (_version == null)
                throw new BusinessLogicException(ExceptionCodeEnum.VERSION_NOT_FOUND);
            return _version;
        }

        public Dealership GetDealershipById(long? dealershipId)
        {
            Dealership _dealership = FEContext.CurrentContext.Dealerships.SingleOrDefault(c => c.Id == dealershipId && !c.Deleted);
            if (_dealership == null)
                throw new BusinessLogicException(ExceptionCodeEnum.DEALERSHIP_NOT_FOUND);
            return _dealership;
        }

        public List<Dealership> GetDealershipsByIds(List<long> dealershipIds)
        {
            List<Dealership> _dealerships = FEContext.CurrentContext.Dealerships.Where(c => dealershipIds.Contains(c.Id) && !c.Deleted).ToList();
            if (_dealerships == null || _dealerships.Count == 0)
                throw new BusinessLogicException(ExceptionCodeEnum.DEALERSHIP_NOT_FOUND);
            return _dealerships;
        }

        public Dealership GetDealershipByDealerCode(string? dealerCode)
        {
            Dealership _dealership = FEContext.CurrentContext.Dealerships.SingleOrDefault(c => c.DealerCode == dealerCode && !c.Deleted);
            if (_dealership == null)
                throw new BusinessLogicException(ExceptionCodeEnum.DEALERSHIP_NOT_FOUND);
            return _dealership;
        }

        public Province CreateProvince(string name)
        {
            Province province = new Province();
            province.Name = name;
            FEContext.CurrentContext.Provinces.Add(province);
            return province;
        }

        public Province GetProvinceById(long? provinceId)
        {
            Province _province = FEContext.CurrentContext.Provinces.SingleOrDefault(c => c.Id == provinceId && !c.Deleted);
            if (_province == null)
                throw new BusinessLogicException(ExceptionCodeEnum.PROVINCE_NOT_FOUND);
            return _province;
        }

        public QuoteForm GetQuoteFormById(long? quoteFormId)
        {
            QuoteForm _quoteForms = FEContext.CurrentContext.QuoteForms.SingleOrDefault(c => c.Id == quoteFormId && !c.Deleted);
            if (_quoteForms == null)
                throw new BusinessLogicException(ExceptionCodeEnum.FORM_NOT_FOUND);
            return _quoteForms;
        }

        public TestDriveForm GetTestDriveFormById(long? testDriveFormId)
        {
            TestDriveForm _testDriveForms = FEContext.CurrentContext.TestDriveForms.SingleOrDefault(c => c.Id == testDriveFormId && !c.Deleted);
            if (_testDriveForms == null)
                throw new BusinessLogicException(ExceptionCodeEnum.FORM_NOT_FOUND);
            return _testDriveForms;
        }

        public NewsletterForm GetNewsletterFormById(long? NewsletterFormId)
        {
            NewsletterForm _newsletterForms = FEContext.CurrentContext.NewsletterForms.SingleOrDefault(c => c.Id == NewsletterFormId && !c.Deleted);
            if (_newsletterForms == null)
                throw new BusinessLogicException(ExceptionCodeEnum.FORM_NOT_FOUND);
            return _newsletterForms;
        }

        public TermsAndCondition GetLatestTermsAndConditions()
        {
            TermsAndCondition terms = FEContext.CurrentContext.TermsAndConditions.Where(c => !c.Deleted).OrderByDescending(c => c.CreatedOn).FirstOrDefault();
            return terms;
        }

        public Configuration GetConfigurationsById(long? configurationId)
        {
            Configuration configurations = FEContext.CurrentContext.Configurations.SingleOrDefault(c => c.Id == configurationId && !c.Deleted); ;
            return configurations;
        }

        public Device GetDeviceByUniqueId(string uniqueId)
        {
            Device device = FEContext.CurrentContext.Devices.FirstOrDefault(c => c.UniqueId == uniqueId && !c.Deleted);
            if (device == null)
                throw new BusinessLogicException(ExceptionCodeEnum.DEVICE_NOT_FOUND);
            return device;
        }

        public Device GetDeviceByUniqueIdOrDefault(string uniqueId)
        {
            return FEContext.CurrentContext.Devices.FirstOrDefault(c => c.UniqueId == uniqueId);
        }

        public Guest GetGuestById(long? guestId)
        {
            Guest guest = FEContext.CurrentContext.Guests.FirstOrDefault(g => g.Id == guestId && !g.Deleted);
            if (guest == null)
                throw new BusinessLogicException(ExceptionCodeEnum.GUEST_NOT_FOUND);
            return guest;
        }

        public Guest GetGuestByIdOrDefault(long? guestId)
        {
            return FEContext.CurrentContext.Guests.FirstOrDefault(g => g.Id == guestId && !g.Deleted);
        }

        public Notification GetNotificationById(long? notificationId)
        {
            Notification notif = FEContext.CurrentContext.Notifications.FirstOrDefault(n => n.Id == notificationId && !n.Deleted);
            if (notif == null)
                throw new BusinessLogicException(ExceptionCodeEnum.NOTIFICATION_NOT_FOUND);
            
            return notif;
        }

    }
}
