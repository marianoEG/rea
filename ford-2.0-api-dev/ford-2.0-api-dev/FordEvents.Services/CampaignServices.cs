using FordEvents.Common;
using FordEvents.Common.Data;
using FordEvents.Common.Data.Campaign;
using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Services;
using FordEvents.Common.Utils;
using FordEvents.Model.FordEventsDB;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Services
{
    public class CampaignServices : BaseServices
    {
        public CampaignServices(CurrentUserService currentUserService) : base(currentUserService) { }

        #region GetCampaignFileList

        public List<string> GetCampaignFileList()
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                List<string> campaignUrls = new List<string>();
                if (Directory.Exists(AppSettings.CampaignsFolder))
                {
                    campaignUrls = new DirectoryInfo(AppSettings.CampaignsFolder)
                      .GetFiles()
                      .Where(x => x.Extension == ".json")
                      .Select(x => AppSettings.BaseUrlToImages + AppSettings.CampaignsFolder + "/" + x.Name)
                      .ToList();
                }

                return campaignUrls;
            }
        }

        #endregion

        #region GetCampaignList

        public PagedList<CampaignData> GetCampaignList(int? pageNumber, int? pageSize, string searchText)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                string filter = string.IsNullOrWhiteSpace(searchText) ? "" : searchText.Trim().ToLower();
                IQueryable<Campaign> query = context.Campaigns
                    .Where(x =>
                        !x.Deleted
                        &&
                        (x.Pat.ToLower().Contains(filter) || x.Vin.ToLower().Contains(filter))
                    );

                PagedList<CampaignData> result = new PagedList<CampaignData>();
                result.ListOfEntities = query.Paginate(pageNumber, pageSize).ToList<object>().ToDataList<CampaignData>();
                result.CurrentPage = pageNumber;
                result.PageSize = pageSize;
                result.TotalItems = query.Count();
                return result;
            }
        }

        #endregion

        #region GetCampaign

        public CampaignData GetCampaign(long campaignId)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                return context.GetCampaignById(campaignId)
                    .ToData<CampaignData>();
            }
        }

        #endregion

        #region DeleteCampaign

        public void DeleteCampaign(string fileName)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                if (File.Exists(AppSettings.CampaignsFolder + "/" + fileName))
                {
                    File.Delete(AppSettings.CampaignsFolder + "/" + fileName);
                }
                else
                {
                     throw new BusinessLogicException(ExceptionCodeEnum.FILE_NOT_FOUND);
                }
            }
        }

        #endregion

        #region CreateCampaign

        public CampaignData CreateCampaign(CampaignData data)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Campaign campaign = new Campaign();
                campaign.CampaignId = data.CampaignId;
                campaign.Env = data.Env;
                campaign.Vin = data.Vin;
                campaign.Cc = data.Cc;
                campaign.Pat = data.Pat;
                campaign.Serv = data.Serv;
                campaign.ServDate = data.ServDate;
                campaign.Manten = data.Manten;
                campaign.Recall1 = data.Recall1;
                campaign.Recall2 = data.Recall2;
                campaign.Validate();
                context.Campaigns.Add(campaign);
                context.SaveChanges();

                return campaign.ToData<CampaignData>();
            }
        }

        #endregion

        #region EditCampaign

        public CampaignData EditCampaign(CampaignData data)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Campaign campaign = context.GetCampaignById(data.Id);
                campaign.CampaignId = data.CampaignId;
                campaign.Env = data.Env;
                campaign.Vin = data.Vin;
                campaign.Cc = data.Cc;
                campaign.Pat = data.Pat;
                campaign.Serv = data.Serv;
                campaign.ServDate = data.ServDate;
                campaign.Manten = data.Manten;
                campaign.Recall1 = data.Recall1;
                campaign.Recall2 = data.Recall2;
                campaign.Validate();
                context.SaveChanges();

                return campaign.ToData<CampaignData>();
            }
        }

        #endregion

        #region DeleteCampaign

        public void DeleteCampaign(long? campaignId)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                context.GetCampaignById(campaignId).Destroy();
                context.SaveChanges();
            }
        }

        #endregion
    }
}
