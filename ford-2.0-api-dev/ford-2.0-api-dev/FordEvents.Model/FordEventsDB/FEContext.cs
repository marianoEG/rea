using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace FordEvents.Model.FordEventsDB
{
    public partial class FEContext : DbContext
    {
        public FEContext()
        {
        }

        public FEContext(DbContextOptions<FEContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Campaign> Campaigns { get; set; }
        public virtual DbSet<CampaignSearch> CampaignSearches { get; set; }
        public virtual DbSet<City> Cities { get; set; }
        public virtual DbSet<Configuration> Configurations { get; set; }
        public virtual DbSet<Dealership> Dealerships { get; set; }
        public virtual DbSet<Device> Devices { get; set; }
        public virtual DbSet<DeviceError> DeviceErrors { get; set; }
        public virtual DbSet<DeviceLog> DeviceLogs { get; set; }
        public virtual DbSet<Event> Events { get; set; }
        public virtual DbSet<Feature> Features { get; set; }
        public virtual DbSet<FeatureVersion> FeatureVersions { get; set; }
        public virtual DbSet<FeaturesGroup> FeaturesGroups { get; set; }
        public virtual DbSet<Guest> Guests { get; set; }
        public virtual DbSet<NewsletterForm> NewsletterForms { get; set; }
        public virtual DbSet<Notification> Notifications { get; set; }
        public virtual DbSet<Province> Provinces { get; set; }
        public virtual DbSet<QuoteForm> QuoteForms { get; set; }
        public virtual DbSet<Session> Sessions { get; set; }
        public virtual DbSet<SubEvent> SubEvents { get; set; }
        public virtual DbSet<TermsAndCondition> TermsAndConditions { get; set; }
        public virtual DbSet<TestDriveForm> TestDriveForms { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Vehicle> Vehicles { get; set; }
        public virtual DbSet<VehicleAccessory> VehicleAccessories { get; set; }
        public virtual DbSet<VehicleColor> VehicleColors { get; set; }
        public virtual DbSet<VehicleImage> VehicleImages { get; set; }
        public virtual DbSet<Version> Versions { get; set; }
        public virtual DbSet<VersionAccessory> VersionAccessories { get; set; }
        public virtual DbSet<VersionImage> VersionImages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            modelBuilder.Entity<Campaign>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CampaignId).HasColumnName("CampaignID");

                entity.Property(e => e.Cc)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.Env)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Manten)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.Pat)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Recall1)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.Recall2)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.Serv)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.ServDate).HasColumnType("datetime");

                entity.Property(e => e.Vin)
                    .HasMaxLength(100)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<CampaignSearch>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CampaignId).HasColumnName("CampaignID");

                entity.Property(e => e.Cc)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("CC");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.EventId).HasColumnName("EventID");

                entity.Property(e => e.Manten)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.Pat)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.SearchDate).HasColumnType("datetime");

                entity.Property(e => e.SearchText)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.Serv)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.ServDate)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.SyncDate).HasColumnType("datetime");

                entity.Property(e => e.Vin)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("VIn");

                entity.HasOne(d => d.Event)
                    .WithMany(p => p.CampaignSearches)
                    .HasForeignKey(d => d.EventId)
                    .HasConstraintName("FK_CampaignSearches_Events");
            });

            modelBuilder.Entity<City>(entity =>
            {
                entity.ToTable("City");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ProvinceId).HasColumnName("ProvinceID");

                entity.HasOne(d => d.Province)
                    .WithMany(p => p.Cities)
                    .HasForeignKey(d => d.ProvinceId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_City_Province");
            });

            modelBuilder.Entity<Configuration>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.Key)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.Value)
                    .IsRequired()
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Dealership>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CityId).HasColumnName("CityID");

                entity.Property(e => e.Code)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.DealerCode)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.Lat).HasColumnType("decimal(18, 10)");

                entity.Property(e => e.Long).HasColumnType("decimal(18, 10)");

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Phone1)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Phone2)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.PostalCode)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ProvinceId).HasColumnName("ProvinceID");

                entity.Property(e => e.StreetNameAndNumber)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.HasOne(d => d.City)
                    .WithMany(p => p.Dealerships)
                    .HasForeignKey(d => d.CityId)
                    .HasConstraintName("FK_Dealerships_City");

                entity.HasOne(d => d.Province)
                    .WithMany(p => p.Dealerships)
                    .HasForeignKey(d => d.ProvinceId)
                    .HasConstraintName("FK_Dealerships_Province");
            });

            modelBuilder.Entity<Device>(entity =>
            {
                entity.HasIndex(e => e.UniqueId, "IX_Devices");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.AppVersion)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Brand)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.FreeSpace)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Ip)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("IP");

                entity.Property(e => e.LastBaseDataDownloadSyncDate).HasColumnType("datetime");

                entity.Property(e => e.LastCampaignDownloadSyncDate).HasColumnType("datetime");

                entity.Property(e => e.LastCampaignUploadSyncDate).HasColumnType("datetime");

                entity.Property(e => e.LastFormsUploadSyncDate).HasColumnType("datetime");

                entity.Property(e => e.LastGuestUploadSyncDate).HasColumnType("datetime");

                entity.Property(e => e.Model)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.OperativeSystem)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.OperativeSystemVersion)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.UniqueId)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("UniqueID");
            });

            modelBuilder.Entity<DeviceError>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.AppVersion)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("appVersion");

                entity.Property(e => e.Brand)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("brand");

                entity.Property(e => e.ConnectionType)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("connectionType");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.Date).HasColumnType("datetime");

                entity.Property(e => e.Description)
                    .HasMaxLength(1000)
                    .IsUnicode(false);

                entity.Property(e => e.DeviceId).HasColumnName("DeviceID");

                entity.Property(e => e.DeviceName)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("deviceName");

                entity.Property(e => e.DeviceUniqueId)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("deviceUniqueId");

                entity.Property(e => e.Model)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("model");

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.OperativeSystem)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("operativeSystem");

                entity.Property(e => e.OperativeSystemVersion)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("operativeSystemVersion");

                entity.Property(e => e.Type)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(d => d.Device)
                    .WithMany(p => p.DeviceErrors)
                    .HasForeignKey(d => d.DeviceId)
                    .HasConstraintName("FK_DeviceErrors_Devices");
            });

            modelBuilder.Entity<DeviceLog>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.ConnectionType)
                    .HasMaxLength(20)
                    .IsFixedLength(true);

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.Date).HasColumnType("datetime");

                entity.Property(e => e.DeviceId).HasColumnName("DeviceID");

                entity.Property(e => e.Ip)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("IP");

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(d => d.Device)
                    .WithMany(p => p.DeviceLogs)
                    .HasForeignKey(d => d.DeviceId)
                    .HasConstraintName("FK_DeviceLogs_Devices");
            });

            modelBuilder.Entity<Event>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Code)
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.DateFrom).HasColumnType("datetime");

                entity.Property(e => e.DateTo).HasColumnType("datetime");

                entity.Property(e => e.Image)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.TestDriveFormsQrcount).HasColumnName("TestDriveFormsQRCount");
            });

            modelBuilder.Entity<Feature>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.FeatureGroupId).HasColumnName("FeatureGroupID");

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.HasOne(d => d.FeatureGroup)
                    .WithMany(p => p.Features)
                    .HasForeignKey(d => d.FeatureGroupId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Features_FeaturesGroup");
            });

            modelBuilder.Entity<FeatureVersion>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.FeatureId).HasColumnName("FeatureID");

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.Value)
                    .IsRequired()
                    .HasMaxLength(2000)
                    .IsUnicode(false);

                entity.Property(e => e.VersionId).HasColumnName("VersionID");

                entity.HasOne(d => d.Feature)
                    .WithMany(p => p.FeatureVersions)
                    .HasForeignKey(d => d.FeatureId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_FeatureVersions_Features");

                entity.HasOne(d => d.Version)
                    .WithMany(p => p.FeatureVersions)
                    .HasForeignKey(d => d.VersionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_FeatureVersions_Versions");
            });

            modelBuilder.Entity<FeaturesGroup>(entity =>
            {
                entity.ToTable("FeaturesGroup");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.VehicleId).HasColumnName("VehicleID");

                entity.HasOne(d => d.Vehicle)
                    .WithMany(p => p.FeaturesGroups)
                    .HasForeignKey(d => d.VehicleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_FeaturesGroup_Vehicles");
            });

            modelBuilder.Entity<Guest>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CarLicencePlate)
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.ChangedByQrscanner).HasColumnName("ChangedByQRScanner");

                entity.Property(e => e.CompanionReference)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.DocumentNumber)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Email)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Firstname)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Lastname)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.Observations1)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.Observations2)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.Observations3)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.PhoneNumber)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.PreferenceDate)
                    .HasMaxLength(15)
                    .IsUnicode(false);

                entity.Property(e => e.PreferenceHour)
                    .HasMaxLength(15)
                    .IsUnicode(false);

                entity.Property(e => e.PreferenceVehicle)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.State)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.SubeventId).HasColumnName("SubeventID");

                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.Zone)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.HasOne(d => d.Subevent)
                    .WithMany(p => p.Guests)
                    .HasForeignKey(d => d.SubeventId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Guests_SubEvents");
            });

            modelBuilder.Entity<NewsletterForm>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.Email)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.EventId).HasColumnName("EventID");

                entity.Property(e => e.Firstname)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("FIrstname");

                entity.Property(e => e.Lastname)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.VehicleOfInterest)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(d => d.Event)
                    .WithMany(p => p.NewsletterForms)
                    .HasForeignKey(d => d.EventId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_NewsletterForms_Events");
            });

            modelBuilder.Entity<Notification>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreatedOnDate).HasColumnType("datetime");

                entity.Property(e => e.DeliveredDate).HasColumnType("datetime");

                entity.Property(e => e.DeviceId).HasColumnName("DeviceID");

                entity.Property(e => e.DeviceUniqueId)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Message).HasMaxLength(500);

                entity.HasOne(d => d.Device)
                    .WithMany(p => p.Notifications)
                    .HasForeignKey(d => d.DeviceId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Notifications_Devices");
            });

            modelBuilder.Entity<Province>(entity =>
            {
                entity.ToTable("Province");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<QuoteForm>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.DealershipId).HasColumnName("DealershipID");

                entity.Property(e => e.DocumentNumber)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.DocumentType)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Email)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.EventId).HasColumnName("EventID");

                entity.Property(e => e.Firstname)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("FIrstname");

                entity.Property(e => e.Lastname)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.Phone1)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Phone2)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.PhoneArea1)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.PhoneArea2)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.PointOfSale)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.VehicleId).HasColumnName("VehicleID");

                entity.HasOne(d => d.Dealership)
                    .WithMany(p => p.QuoteForms)
                    .HasForeignKey(d => d.DealershipId)
                    .HasConstraintName("FK_QuoteForms_Dealerships");

                entity.HasOne(d => d.Event)
                    .WithMany(p => p.QuoteForms)
                    .HasForeignKey(d => d.EventId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_QuoteForms_Events");

                entity.HasOne(d => d.Vehicle)
                    .WithMany(p => p.QuoteForms)
                    .HasForeignKey(d => d.VehicleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_QuoteForms_Vehicles");
            });

            modelBuilder.Entity<Session>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.EndDate).HasColumnType("datetime");

                entity.Property(e => e.ExpirationDate).HasColumnType("datetime");

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.StartDate).HasColumnType("datetime");

                entity.Property(e => e.Token)
                    .IsRequired()
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Sessions)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Sessions_Users");
            });

            modelBuilder.Entity<SubEvent>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.DateFrom).HasColumnType("datetime");

                entity.Property(e => e.DateTo).HasColumnType("datetime");

                entity.Property(e => e.EventId).HasColumnName("EventID");

                entity.Property(e => e.Image)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.HasOne(d => d.Event)
                    .WithMany(p => p.SubEvents)
                    .HasForeignKey(d => d.EventId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SubEvents_Events");
            });

            modelBuilder.Entity<TermsAndCondition>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.Text).IsUnicode(false);

                entity.Property(e => e.Version)
                    .HasMaxLength(10)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<TestDriveForm>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Brand)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.DateOfPurchase).HasColumnType("datetime");

                entity.Property(e => e.EventId).HasColumnName("EventID");

                entity.Property(e => e.Firstname)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("FIrstname");

                entity.Property(e => e.Lastname)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.LicencePlate)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Model)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.VehicleId).HasColumnName("VehicleID");

                entity.Property(e => e.VehicleOfInterest)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(d => d.Event)
                    .WithMany(p => p.TestDriveForms)
                    .HasForeignKey(d => d.EventId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_TestDriveForms_Events");

                entity.HasOne(d => d.Vehicle)
                    .WithMany(p => p.TestDriveForms)
                    .HasForeignKey(d => d.VehicleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_TestDriveForms_Vehicles");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.Id)
                    .ValueGeneratedNever()
                    .HasColumnName("ID");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.ExpirationDate).HasColumnType("datetime");

                entity.Property(e => e.Firstname)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Lastname)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.Profile)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Vehicle>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.Image)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<VehicleAccessory>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.Description)
                    .HasMaxLength(1000)
                    .IsUnicode(false);

                entity.Property(e => e.Image)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.ModelFor)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Observation)
                    .HasMaxLength(2000)
                    .IsUnicode(false);

                entity.Property(e => e.PartNumber)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.VehicleId).HasColumnName("VehicleID");

                entity.HasOne(d => d.Vehicle)
                    .WithMany(p => p.VehicleAccessories)
                    .HasForeignKey(d => d.VehicleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_VehicleAccessories_Vehicles");
            });

            modelBuilder.Entity<VehicleColor>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.ColorImageUrl)
                    .IsRequired()
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.ColorName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.VehicleId).HasColumnName("VehicleID");

                entity.Property(e => e.VehicleImageUrl)
                    .IsRequired()
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.HasOne(d => d.Vehicle)
                    .WithMany(p => p.VehicleColors)
                    .HasForeignKey(d => d.VehicleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_VehicleColors_Vehicles");
            });

            modelBuilder.Entity<VehicleImage>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.VehicleId).HasColumnName("VehicleID");

                entity.Property(e => e.VehicleImageUrl)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.HasOne(d => d.Vehicle)
                    .WithMany(p => p.VehicleImages)
                    .HasForeignKey(d => d.VehicleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_VehicleImages_Vehicles");
            });

            modelBuilder.Entity<Version>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.Currency)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ModelYear)
                    .HasMaxLength(4)
                    .IsUnicode(false);

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Seq)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("SEQ");

                entity.Property(e => e.Tma)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("TMA");

                entity.Property(e => e.VehicleId).HasColumnName("VehicleID");

                entity.HasOne(d => d.Vehicle)
                    .WithMany(p => p.Versions)
                    .HasForeignKey(d => d.VehicleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Versions_Vehicles");
            });

            modelBuilder.Entity<VersionAccessory>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.Description)
                    .HasMaxLength(1000)
                    .IsUnicode(false);

                entity.Property(e => e.Image)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.VersionId).HasColumnName("VersionID");

                entity.HasOne(d => d.Version)
                    .WithMany(p => p.VersionAccessories)
                    .HasForeignKey(d => d.VersionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_VersionAccessories_Versions");
            });

            modelBuilder.Entity<VersionImage>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

                entity.Property(e => e.VehicleImageUrl)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.VersionId).HasColumnName("VersionID");

                entity.HasOne(d => d.Version)
                    .WithMany(p => p.VersionImages)
                    .HasForeignKey(d => d.VersionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_VersionImages_Versions");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
