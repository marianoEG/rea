using FordEvents.Common.Services;
using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Model.FordEventsDB;
using System.Collections.Generic;
using System.Linq;
using FordEvents.Common.Data.Configuration;

namespace FordEvents.Services
{
    public class ConfigurationServices : BaseServices
    {
        public ConfigurationServices(CurrentUserService currentUserService) : base(currentUserService) { }

        public List<ConfigurationData> GetConfigurations()
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                IQueryable<Configuration> query = context.Configurations
                    .Where(x =>
                        !x.Deleted
                    );

                return query.ToList<object>().ToDataList<ConfigurationData>();
            }
        }

        public void RecieveConfigurations(List<ConfigurationData> configurations)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                foreach (var configuration in configurations) 
                {
                    if (configuration.Id == null)
                    {
                        this.CreateConfiguration(configuration);
                    }
                    else { 
                        this.EditConfiguration(configuration);
                    }
                }

            }
        }

        private ConfigurationData CreateConfiguration(ConfigurationData configData)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Configuration _config = new Configuration();
                _config.Key = configData.Key;
                _config.Value = configData.Value;
                _config.Validate();
                context.Configurations.Add(_config);
                context.SaveChanges();

                return _config.ToData<ConfigurationData>();
            }
        }

        private ConfigurationData EditConfiguration(ConfigurationData configData)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Configuration _config = context.GetConfigurationsById(configData.Id);
                _config.Key = configData.Key;
                _config.Value = configData.Value;
                _config.Validate();
                context.SaveChanges();

                return _config.ToData<ConfigurationData>();
            }
        }

    }
}
