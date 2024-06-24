using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FordEvents.Services;
using FordEvents.Common.Data;
using FordEvents.Model.FordEventsDB;
using FordEvents.Common.Data.User;

namespace FordEvents.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : BaseController
    {
        private UserServices _userServices;

        public UserController(UserServices userServices)
        {
            _userServices = userServices;
        }

    
        [HttpGet, Route("list")]
        public PagedList<UserData> GetUsersList([FromQuery] int? pageNumber, [FromQuery] int? pageSize, [FromQuery] string searchText)
        {
            return _userServices.GetUsersList(pageNumber, pageSize, searchText);
        }

   
        [HttpGet, Route("{userId}")]
        public UserData GetUserById( Guid userId)
        {
            return _userServices.GetUser(userId);
        }

        [HttpPost, Route("")]
        public UserData CreateUser([FromBody] UserCreateData userData)
        {
            return _userServices.CreateUser(userData);
        }

        [HttpPut, Route("")]
        public UserData EditUser([FromBody] UserData userData) { 
            return _userServices.EditUser(userData);
        }

        [HttpDelete, Route("{userId}")]
        public void DeleteUser(Guid userId)
        {
            _userServices.DeleteUser(userId);
        }

        [AllowAnonymous]
        [HttpPost, Route("change-password")]
        public void ChangePassword([FromBody] UserChangePassData changePassData)
        {
            _userServices.updatePassword(changePassData);
        }

    }
}
