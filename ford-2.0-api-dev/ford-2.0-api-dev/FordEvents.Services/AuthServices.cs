using FordEvents.Common.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FordEvents.Common.Data;
using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Model.FordEventsDB;
using FordEvents.Common.Utils;

namespace FordEvents.Services
{
    public class AuthServices : BaseServices
    {
        public AuthServices(CurrentUserService currentUserService) : base(currentUserService) { }

        public SessionDeepData Login(LoginBodyData loginData)
        {
            using (var context = this.GetCurrentContext())
            {
                User user = context.Users.Where(user => user.Email == loginData.Email && !user.Deleted).SingleOrDefault();
                if (user == null || !user.isCorrectPassword(loginData.Password))
                    throw new BusinessLogicException(ExceptionCodeEnum.USERNAME_OR_PASSWORD_INCORRECT);
                
                if (DateTime.UtcNow >= user.ExpirationDate) {
                    throw new BusinessLogicException(ExceptionCodeEnum.USER_PASSWORD_EXPIRED);
                }

                Session session = user.StartSession();
                context.SaveChanges();

                return session.ToData<SessionDeepData>();
            }
        }
    }
}
