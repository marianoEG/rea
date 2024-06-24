using FordEvents.Common.Data.Province;
using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace FordEvents.Model.FordEventsDB
{
    public partial class Province : IAuditable, IDestroyable
    {

        public City GetCityById(long? cityId)
        {
            City _city = FEContext.CurrentContext.Cities.SingleOrDefault(c => c.Id == cityId && !c.Deleted);
            if (_city == null)
                throw new BusinessLogicException(ExceptionCodeEnum.CITY_NOT_FOUND);
            return _city;
        }

        public List<City> GetCities()
        {
            return this.Cities.Where(x => !x.Deleted).ToList();
        }

        public List<City> GetSyncCities()
        {
            return FEContext.CurrentContext.Dealerships
                .Where(x => x.ProvinceId == this.Id && !x.Deleted)
                .Select(x => x.City)
                .Distinct()
                .ToList();
        }

        public City CreateCity(string name)
        {
            City city = new City();
            city.Name = name;
            city.Province = this;
            FEContext.CurrentContext.Cities.Add(city);
            return city;
        }
        

        public void Destroy()
        {
            this.Deleted = true;
        }
    }
}