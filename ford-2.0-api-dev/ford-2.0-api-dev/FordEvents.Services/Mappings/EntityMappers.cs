
using AutoMapper;
using FordEvents.Common;
using FordEvents.Common.Data;
using FordEvents.Common.Data.Campaign;
using FordEvents.Common.Data.CampaignSearch;
using FordEvents.Common.Data.CampaignSearches;
using FordEvents.Common.Data.City;
using FordEvents.Common.Data.Configuration;
using FordEvents.Common.Data.Dealership;
using FordEvents.Common.Data.Device;
using FordEvents.Common.Data.Event;
using FordEvents.Common.Data.Form;
using FordEvents.Common.Data.Notification;
using FordEvents.Common.Data.Province;
using FordEvents.Common.Data.SaleForce;
using FordEvents.Common.Data.Sync;
using FordEvents.Common.Data.TermsAndConditions;
using FordEvents.Common.Data.Vehicle;
using FordEvents.Model.FordEventsDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Model.FordEventsDB
{
    public class EntityMappers
    {

        public static EntityMappers Instance;
        public MapperConfiguration MapperConfiguration { get; set; }

        public static void Config()
        {
            if (Instance == null)
                Instance = new EntityMappers();
        }

        private EntityMappers()
        {
            this.MapperConfiguration = new MapperConfiguration(cnf =>
            {
                // Session
                cnf.CreateMap<Session, SessionData>();
                cnf.CreateMap<Session, SessionDeepData>()
                    .ForMember(target => target.Email, source => source.MapFrom(src => src.User.Email))
                    .ForMember(target => target.Firstname, source => source.MapFrom(src => src.User.Firstname))
                    .ForMember(target => target.Lastname, source => source.MapFrom(src => src.User.Lastname))
                    .ForMember(target => target.Profile, source => source.MapFrom(src => src.User.Profile));

                // User
                cnf.CreateMap<User, UserData>();

                // Event
                cnf.CreateMap<Event, EventData>();

                // SubEvent
                cnf.CreateMap<SubEvent, SubEventData>();

                // Vehicle
                cnf.CreateMap<Vehicle, VehicleData>();
                cnf.CreateMap<Vehicle, VehicleDeepData>()
                   .ForMember(target => target.FeaturesGroups, source => source.MapFrom(src => src.GetFeaturesGroups()))
                   .ForMember(target => target.Images, source => source.MapFrom(src => src.GetImages()))
                   .ForMember(target => target.Colors, source => source.MapFrom(src => src.GetColors()));
                cnf.CreateMap<Vehicle, SyncVehicleData>()
                    .ForMember(target => target.FeaturesGroups, source => source.MapFrom(src => src.GetFeaturesGroups()))
                    .ForMember(target => target.Images, source => source.MapFrom(src => src.GetImages()))
                    .ForMember(target => target.Colors, source => source.MapFrom(src => src.GetColors()))
                    .ForMember(target => target.Versions, source => source.MapFrom(src => src.GetVersions()))
                    .ForMember(target => target.accessories, source => source.MapFrom(src => src.GetAccessories()));


                // Version
                cnf.CreateMap<Version, VersionData>();
                cnf.CreateMap<Version, VersionDeepData>()
                    .ForMember(target => target.FeatureVersions, source => source.MapFrom(src => src.GetFeaturesVersions()));
                cnf.CreateMap<Version, SyncVehicleVersionData>()
                    .ForMember(target => target.Features, source => source.MapFrom(src => src.GetFeaturesVersions()));

                // Features Group
                cnf.CreateMap<FeaturesGroup, FeaturesGroupData>();
                cnf.CreateMap<FeaturesGroup, FeaturesGroupDeepData>()
                    .ForMember(target => target.Features, source => source.MapFrom(src => src.GetFeatures()));
                cnf.CreateMap<FeaturesGroup, SyncFeaturesGroupDeepData>()
                    .ForMember(target => target.Features, source => source.MapFrom(src => src.GetFeatures()));

                // Features
                cnf.CreateMap<Feature, FeatureData>();
                cnf.CreateMap<Feature, FeatureDeepData>()
                    .ForMember(target => target.FeatureVersions, source => source.MapFrom(src => src.FeatureVersions));

                // Feature version
                cnf.CreateMap<FeatureVersion, FeatureVersionData>();
                cnf.CreateMap<FeatureVersion, SyncFeatureVersionData>();

                // Sync
                cnf.CreateMap<Event, SyncEventData>()
                    .ForMember(target => target.SubEvents, source => source.MapFrom(src => src.GetSubEvents()));
                cnf.CreateMap<SubEvent, SyncSubEventData>()
                    .ForMember(target => target.Guests, source => source.MapFrom(src => src.GetGuests()));

                // Vehicle Images
                cnf.CreateMap<VehicleImage, VehicleImageData>();
                cnf.CreateMap<VehicleImage, SyncVehicleImageData>();

                // Vehicle Color
                cnf.CreateMap<VehicleColor, VehicleColorData>();
                cnf.CreateMap<VehicleColor, SyncVehicleColorData>();

                // Vehicle Accessory
                cnf.CreateMap<VehicleAccessory, VehicleAccessoryData>();
                cnf.CreateMap<VehicleAccessory, SyncVehicleAccessoryData>();

                // Dealership
                cnf.CreateMap<Dealership, DealershipData>();
                cnf.CreateMap<Dealership, SyncDealershipData>()
                 .ForMember(target => target.CityName, source => source.MapFrom(src => src.City.Name))
                 .ForMember(target => target.ProvinceName, source => source.MapFrom(src => src.Province.Name));

                // Province
                cnf.CreateMap<Province, ProvinceData>();
                cnf.CreateMap<Province, SyncProvinceData>()
                .ForMember(target => target.cities, source => source.MapFrom(src => src.GetSyncCities()));

                // City
                cnf.CreateMap<City, CityData>();
                cnf.CreateMap<City, SyncCityData>();

                // Guest
                cnf.CreateMap<Guest, GuestData>()
                    .ForMember(target => target.DataToScan, source => source.MapFrom(src => src.GetDataToScan()));
                cnf.CreateMap<Guest, SyncGuestData>();
                cnf.CreateMap<Guest, SyncGuestDeepData>()
                 .ForMember(target => target.EventId, source => source.MapFrom(src => src.Subevent.EventId));

                cnf.CreateMap<Guest, SaleForceGuestBody>()
                    .ForMember(target => target.keys, source => source.MapFrom(src => new SaleForceGuestKeysBody()
                    {
                        ID = src.Id + "-" + src.Subevent.Event.Code
                    }))
                    .ForMember(target => target.values, source => source.MapFrom(src => new SaleForceGuestValuesBody()
                    {
                        SubeventID = src.Subevent.Id.ToString(),
                        SubeventName = src.Subevent.Name,
                        Firstname = src.Firstname,
                        Lastname = src.Lastname,
                        DocumentNumber = src.DocumentNumber,
                        PhoneNumber = src.PhoneNumber,
                        Email = src.Email,
                        CarLicencePlate = src.CarLicencePlate,
                        Type = src.Type,
                        CompanionReference = src.CompanionReference,
                        Observations1 = src.Observations1,
                        Observations2 = src.Observations2,
                        Observations3 = src.Observations3,
                        Zone = src.Zone,
                        state = src.State,
                        ChangedByQRScanner = src.ChangedByQrscanner.HasValue ? src.ChangedByQrscanner.Value.ToString() : "false",
                        QrUrl = AppSettings.guestQRUrl + src.Id
                    }));

                // Quote Form
                cnf.CreateMap<QuoteForm, QuoteFormData>();

                // Test Drive Form
                cnf.CreateMap<TestDriveForm, TestDriveFormData>();

                // Newsletter Form
                cnf.CreateMap<NewsletterForm, NewsletterFormData>();

                // Terms And Conditions
                cnf.CreateMap<TermsAndCondition, TermsAndConditionsData>();

                // Configuration
                cnf.CreateMap<Configuration, ConfigurationData>();

                // Campaign Search
                cnf.CreateMap<CampaignSearch, CampaignSearchData>()
                    .ForMember(target => target.EventName, source => source.MapFrom(src => src.Event.Name));

                // Campaign
                cnf.CreateMap<Campaign, CampaignData>();

                cnf.CreateMap<Device, DeviceData>();
                cnf.CreateMap<Device, DeviceDeepData>()
                    .ForMember(target => target.Logs, source => source.MapFrom(src => src.GetLogs()))
                    .ForMember(target => target.Errors, source => source.MapFrom(src => src.GetErrors()))
                    .ForMember(target => target.Notifications, source => source.MapFrom(src => src.GetNotifications()));
                cnf.CreateMap<DeviceLog, DeviceLogData>();
                cnf.CreateMap<DeviceError, DeviceErrorData>();

                // Notification
                cnf.CreateMap<Notification, NotificationData>();

            });
        }
    }

    public static class MapperExtension
    {
        public static T ToData<T>(this object source)
        {
            if (source == null)
                return default(T);
            EntityMappers.Config();
            return EntityMappers.Instance.MapperConfiguration.CreateMapper().Map<T>(source);
        }

        public static List<T> ToDataList<T>(this IList<object> source)
        {
            if (source == null)
                return default(List<T>);
            EntityMappers.Config();
            List<T> result = new List<T>();
            foreach (var item in source)
                result.Add(EntityMappers.Instance.MapperConfiguration.CreateMapper().Map<T>(item));
            return result;
        }
    }

}
