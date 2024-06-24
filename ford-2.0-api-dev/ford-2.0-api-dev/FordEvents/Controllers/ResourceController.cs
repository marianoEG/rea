using FordEvents.API.Controllers;
using FordEvents.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting.Server;
using System.IO;
using FordEvents.Common;

namespace FordEvents.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ResourceController: BaseController
    {
        private ResourceServices _resourceServices;
        private readonly IServer server;

        public ResourceController(IServer server, ResourceServices resourceServices)
        {
            this.server = server;
            this._resourceServices = resourceServices;
        }

        [AllowAnonymous]
        [HttpPost, Route("upload-file")]
        public Task<string> UploadFile(IFormCollection data)
        {
            string relativeUrl = _resourceServices.UploadFile(data).Result;
            return Task.Run(() => Path.Combine(AppSettings.BaseUrlToImages, relativeUrl));
        }
    }
}
