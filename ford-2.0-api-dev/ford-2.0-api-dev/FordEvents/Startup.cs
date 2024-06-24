using FordEvents.API.ActionFilters;
using FordEvents.API.Middlewares;
using FordEvents.ApiClientInvoker;
using FordEvents.Common;
using FordEvents.Common.Services;
using FordEvents.Common.Utils;
using FordEvents.Model.FordEventsDB;
using FordEvents.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace FordEvents
{
    public class Startup
    {
        readonly string MyAllowSpecificOrigins = "_CorsOriginstoLocalHost";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers(options => { options.AllowEmptyInputInBodyModelBinding = true; });
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "FordEvents", Version = "v1" });
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please insert JWT with Bearer into field",
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement {
                   {
                     new OpenApiSecurityScheme
                     {
                       Reference = new OpenApiReference
                       {
                         Type = ReferenceType.SecurityScheme,
                         Id = "Bearer"
                       }
                      },
                      new string[] { }
                    }
                });
            });

            services.AddHttpClient(Options.DefaultName, c => { }).ConfigurePrimaryHttpMessageHandler(() =>
            {
                return new HttpClientHandler
                {
                    ClientCertificateOptions = ClientCertificateOption.Manual,
                    ServerCertificateCustomValidationCallback = (httpRequestMessage, cert, certChain, policyErrors) => true
                };
            });


            // Scoped ActionFilters
            services.AddScoped<LogActionFilter>();
            services.AddScoped<SyncDeviceAuditFilter>();

            // Scoped Services.
            services.AddScoped<CurrentUserService>();
            services.AddScoped<AuthServices>();
            services.AddScoped<UserServices>();
            services.AddScoped<EventServices>();
            services.AddScoped<SubEventServices>();
            services.AddScoped<ResourceServices>();
            services.AddScoped<VehicleServices>();
            services.AddScoped<VehicleAccessoryServices>();
            services.AddScoped<VersionServices>();
            services.AddScoped<SyncServices>();
            services.AddScoped<DealershipServices>();
            services.AddScoped<ProvinceServices>();
            services.AddScoped<CityServices>();
            services.AddScoped<GuestServices>();
            services.AddScoped<FormServices>();
            services.AddScoped<TermsAndConditionsServices>();
            services.AddScoped<ConfigurationServices>();
            services.AddScoped<CampaignServices>();
            services.AddScoped<CampaignSearchServices>();
            services.AddScoped<SyncDeviceAuditServices>();
            services.AddScoped<DeviceServices>();
            services.AddScoped<CampaignApiInvoker>();
            services.AddScoped<SaleForceApiInvoker>();
            services.AddScoped<NotificationServices>();

            // Add Json Web Token
            JWTHelper.Initialize(services, Configuration.GetValue<string>("JWTSecretKey"));

            // AppSettings Properties
            AppSettings.BaseUrlToImages = Configuration.GetValue<string>("BaseUrlToImages");
            AppSettings.WildcardPassword = Configuration.GetValue<string>("WildcardPassword");
            AppSettings.JWTExpirationTimeInMinutes = Configuration.GetValue<int>("JWTExpirationTimeInMinutes");
            AppSettings.PageSizeByDefault = Configuration.GetValue<int>("PageSizeByDefault");
            AppSettings.AmazonS3BucketAccessKey = Configuration.GetValue<string>("AmazonS3BucketAccessKey");
            AppSettings.AmazonS3BucketSecretKey = Configuration.GetValue<string>("AmazonS3BucketSecretKey");
            AppSettings.AmazonS3BucketBaseUrl = Configuration.GetValue<string>("AmazonS3BucketBaseUrl");
            AppSettings.AmazonS3BucketName = Configuration.GetValue<string>("AmazonS3BucketName");
            AppSettings.CampaignUrl= Configuration.GetValue<string>("CampaignUrl");
            AppSettings.ImagesFolder = Configuration.GetValue<string>("ImagesFolder");
            AppSettings.FilesFolder = Configuration.GetValue<string>("FilesFolder");
            AppSettings.CampaignsFolder = Configuration.GetValue<string>("CampaignsFolder");
            AppSettings.AssetsFolder= Configuration.GetValue<string>("AssetsFolder");
            AppSettings.ConnectionTestFile = Configuration.GetValue<string>("ConnectionTestFile");
            AppSettings.PasswordExpirationDays = Configuration.GetValue<int>("PasswordExpirationDays");
            // AppSettings SaleForce Properties
            AppSettings.saleForceOAuthUrl = Configuration.GetValue<string>("saleForceOAuthUrl");
            AppSettings.saleForceOAuthGrantType = Configuration.GetValue<string>("saleForceOAuthGrantType");
            AppSettings.saleForceOAuthClientId = Configuration.GetValue<string>("saleForceOAuthClientId");
            AppSettings.saleForceOAuthClientSecret = Configuration.GetValue<string>("saleForceOAuthClientSecret");
            AppSettings.saleForceOAuthAccountId = Configuration.GetValue<string>("saleForceOAuthAccountId");
            AppSettings.saleForceSyncGuestUrl = Configuration.GetValue<string>("saleForceSyncGuestUrl");
            AppSettings.guestQRUrl = Configuration.GetValue<string>("guestQRUrl");

            services.AddHttpContextAccessor();

            // DataBase Config
            string connectionString = Configuration.GetConnectionString("FE-Database");
            FEContext.connectionString = connectionString;
            services.AddDbContext<FEContext>(options =>
            {
                options.UseLazyLoadingProxies(true);
                options.UseSqlServer(connectionString);
            });

            // Cors
            services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins,
                                  builder =>
                                  {
                                      //builder.WithOrigins("http://localhost:4200");
                                      builder.AllowAnyOrigin()
                                             .AllowAnyMethod()
                                             .AllowAnyHeader();
                                  });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            //if (env.IsDevelopment())
            //{
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("./v1/swagger.json", "FordEvents v1"));
            //}

            app.UseStaticFiles();

            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "uploads")),
                RequestPath = new PathString("/uploads")
            });

            app.UseCors(MyAllowSpecificOrigins);
            app.UseMiddleware<HandleExceptionMiddleware>();

            // TODO: verificar si esto debe ir o no
            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
