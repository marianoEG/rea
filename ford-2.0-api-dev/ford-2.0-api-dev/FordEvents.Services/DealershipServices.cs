using Amazon.S3.Model;
using FordEvents.Common.Data;
using FordEvents.Common.Data.City;
using FordEvents.Common.Data.Dealership;
using FordEvents.Common.Data.Event;
using FordEvents.Common.Data.Province;
using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Services;
using FordEvents.Model.FordEventsDB;
using Microsoft.AspNetCore.Http;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Xml.Linq;

namespace FordEvents.Services
{
    public class DealershipServices : BaseServices
    {
        public DealershipServices(CurrentUserService currentUserService) : base(currentUserService) {
        }

        public PagedList<DealershipData> GetDealershipsList(int? pageNumber, int? pageSize, string searchText, int? provinceId, int? cityId)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin() && !_currentUserService.IsReadOnly())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                string filter = string.IsNullOrWhiteSpace(searchText) ? "" : searchText.Trim().ToLower();
                IQueryable<Dealership> query = context.Dealerships
                    .Where(x =>
                        !x.Deleted
                        &&
                        (provinceId == null || x.ProvinceId == provinceId)
                        &&
                        (cityId == null || x.CityId == cityId)
                        &&
                        (x.Name.ToLower().Contains(filter))
                    );

                PagedList<DealershipData> result = new PagedList<DealershipData>();
                result.ListOfEntities = query.Paginate(pageNumber, pageSize).ToList<object>().ToDataList<DealershipData>();
                result.CurrentPage = pageNumber;
                result.PageSize = pageSize;
                result.TotalItems = query.Count();

                return result;
            }
        }

        public DealershipData GetDealership(long dealershipId)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin() && !_currentUserService.IsReadOnly())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                return context.GetDealershipById(dealershipId)
                    .ToData<DealershipData>();
            }
        }

        public DealershipData CreateDealership(DealershipData dealershipData)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Dealership _dealership = this.InsertDealership(dealershipData);
                context.SaveChanges();

                return _dealership.ToData<DealershipData>();

            }
        }

        public DealershipData EditDealership(DealershipData dealershipData)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Dealership _dealership = context.GetDealershipById(dealershipData.Id);
                this.EditDealership(_dealership, dealershipData);
                context.SaveChanges();

                return _dealership.ToData<DealershipData>();
            }
        }

        public void DeleteDealership(long dealershipId)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                context.GetDealershipById(dealershipId).Destroy();
                context.SaveChanges();
            }
        }

        public void DeleteDealerships(List<long> dealershipIds)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                List<Dealership> dealerships = context.GetDealershipsByIds(dealershipIds);
                foreach(var dealership in dealerships)
                {
                    dealership.Destroy();
                }
                context.SaveChanges();
            }
        }

        public bool DealershipExist(string dealerCode)
        {
            return FEContext.CurrentContext.Dealerships
                .Any(x =>
                    x.DealerCode == dealerCode
                    &&
                    !x.Deleted
                );
        }

        public void ImportDealershipList(IFormCollection data)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

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
                            DealershipData dealershipData = new DealershipData();

                            dealershipData.Name = firstWorksheet.Cells[row, 1].Value?.ToString();
                            dealershipData.Code = firstWorksheet.Cells[row, 2].Value?.ToString();

                            // Hago una query que busca la provincia a traves de su nombre y así obtener su id
                            string provinceName = firstWorksheet.Cells[row, 3].Value?.ToString();
                            Province province = context.Provinces.SingleOrDefault(p => p.Name == provinceName);

                            if (province == null)
                                province = context.CreateProvince(provinceName);


                            // Hago una query que busca la ciudad a traves de su nombre y así obtener su id
                            string cityName = firstWorksheet.Cells[row, 4].Value?.ToString();
                            City city = context.Cities.FirstOrDefault(c => c.Name == cityName && c.ProvinceId == dealershipData.ProvinceId);

                            if (city == null) {
                                city = province.CreateCity(cityName);
                            }

                            dealershipData.Lat = firstWorksheet.Cells[row, 5].Value?.ToString().AsDecimal();
                            dealershipData.Long = firstWorksheet.Cells[row, 6].Value?.ToString().AsDecimal();
                            dealershipData.StreetNameAndNumber = firstWorksheet.Cells[row, 7].Value?.ToString();
                            dealershipData.PostalCode = firstWorksheet.Cells[row, 8].Value?.ToString();
                            dealershipData.Phone1 = firstWorksheet.Cells[row, 9].Value?.ToString();
                            dealershipData.Phone2 = firstWorksheet.Cells[row, 10].Value?.ToString();
                            dealershipData.DealerCode = firstWorksheet.Cells[row, 11].Value?.ToString();

                            if (this.DealershipExist(dealershipData.DealerCode))
                                this.EditDealership(context.GetDealershipByDealerCode(dealershipData.DealerCode), dealershipData, province, city);
                            else
                                this.InsertDealership(dealershipData, province, city);
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

        #region Private Methods

        private Dealership InsertDealership(DealershipData dealershipData, Province province = null, City city = null)
        {
            Dealership _dealership = new Dealership();
            _dealership.Code = dealershipData.Code;
            _dealership.Name = dealershipData.Name;
            _dealership.Lat = dealershipData.Lat;
            _dealership.Long = dealershipData.Long;
            _dealership.Province = province != null ? province : this.GetCurrentContext().GetProvinceById(dealershipData.ProvinceId);
            _dealership.City = city != null ? city : _dealership.Province?.GetCityById(dealershipData.CityId);
            _dealership.StreetNameAndNumber = dealershipData.StreetNameAndNumber;
            _dealership.PostalCode = dealershipData.PostalCode;
            _dealership.Phone1 = dealershipData.Phone1;
            _dealership.Phone2 = dealershipData.Phone2;
            _dealership.DealerCode = dealershipData.DealerCode;
            _dealership.Validate();
            this.GetCurrentContext().Dealerships.Add(_dealership);
            return _dealership;
        }

        private void EditDealership(Dealership _dealership, DealershipData dealershipData, Province province = null, City city = null)
        {
            _dealership.Code = dealershipData.Code;
            _dealership.Name = dealershipData.Name;
            _dealership.Lat = dealershipData.Lat;
            _dealership.Long = dealershipData.Long;
            _dealership.Province = province != null ? province : this.GetCurrentContext().GetProvinceById(dealershipData.ProvinceId);
            _dealership.City = city != null ? city : _dealership.Province?.GetCityById(dealershipData.CityId);
            _dealership.StreetNameAndNumber = dealershipData.StreetNameAndNumber;
            _dealership.PostalCode = dealershipData.PostalCode;
            _dealership.Phone1 = dealershipData.Phone1;
            _dealership.Phone2 = dealershipData.Phone2;
            _dealership.DealerCode = dealershipData.DealerCode;
            _dealership.Validate();
        }

        #endregion
    }
}
