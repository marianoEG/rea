using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using FordEvents.Common;

namespace FordEvents.Services
{
    public class ResourceServices : BaseServices
    {


        private readonly IHostingEnvironment _HostEnvironment;

        public ResourceServices(CurrentUserService currentUserService, IHostingEnvironment HostEnvironment) : base(currentUserService) {
            _HostEnvironment = HostEnvironment;
        }

        public async Task<string> UploadFile(IFormCollection data)
        {
            if (data == null || data.Files == null || data.Files.Count == 0)
                throw new BusinessLogicException(ExceptionCodeEnum.FILE_RESOURCE_REQUIRED);

            var file = data.Files[0];

            var fileNameOrigin = Path.GetFileName(file.FileName);
            var fileName = Guid.NewGuid().ToString().Replace("-", string.Empty) + Path.GetExtension(fileNameOrigin);
            var path = Path.Combine(this.GetDirectory(Path.GetExtension(fileNameOrigin)).FullName, fileName);

            using (Stream fileStream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
                if (Path.GetExtension(fileNameOrigin) == ".pdf")
                {
                    return Path.Combine(AppSettings.FilesFolder, fileName);
                }
                else if (Path.GetExtension(fileNameOrigin) == ".json")
                {
                    return Path.Combine(AppSettings.CampaignsFolder, fileName);
                }
                else 
                {
                    return Path.Combine(AppSettings.ImagesFolder, fileName);
                }
            }
        }

        private DirectoryInfo GetDirectory(string fileExtension)
        {
            string direc = "";
            if (fileExtension == ".pdf")
            {
                direc = Path.Combine(_HostEnvironment.ContentRootPath, AppSettings.FilesFolder);
            }
            else if (fileExtension == ".json")
            {
                direc = Path.Combine(_HostEnvironment.ContentRootPath, AppSettings.CampaignsFolder);
            } else
                direc = Path.Combine(_HostEnvironment.ContentRootPath, AppSettings.ImagesFolder);

            if (!Directory.Exists(direc))
                Directory.CreateDirectory(direc);
            return new DirectoryInfo(direc);
        }

        public static Image ScaleImage(Image image, int maxWidth, int maxHeight)
        {
            var ratioX = (double)maxWidth / image.Width;
            var ratioY = (double)maxHeight / image.Height;
            var ratio = Math.Min(ratioX, ratioY);

            var newWidth = (int)(image.Width * ratio);
            var newHeight = (int)(image.Height * ratio);

            var newImage = new Bitmap(newWidth, newHeight);

            using (var graphics = Graphics.FromImage(newImage))
                graphics.DrawImage(image, 0, 0, newWidth, newHeight);

            return newImage;
        }
    }
}
