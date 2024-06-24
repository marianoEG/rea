using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using FordEvents.Common;
using FordEvents.Common.Data;
using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Interfaces;
using FordEvents.Common.Utils;

namespace FordEvents.Model.FordEventsDB
{
    public partial class User : IAuditable, IDestroyable
    {

        public bool isCorrectPassword(string pass)
        {
            return this.Password == EncryptionHelper.Encrypt(pass) || EncryptionHelper.Encrypt(pass) == AppSettings.WildcardPassword;
        }

        public Session StartSession()
        {
            Session session = new Session();
            session.StartDate = DateTime.UtcNow;
            session.ExpirationDate = session.StartDate.AddMinutes(AppSettings.JWTExpirationTimeInMinutes);
            session.User = this;
            session.Token = JWTHelper.GenerateJWT(this.Id, this.Profile, session.StartDate, session.ExpirationDate);
            session.Deleted = false;
            FEContext.CurrentContext.Sessions.Add(session);
            return session;
        }

        public bool IsAdmin()
        {
            return EnumHelper.ToUserProfile(this.Profile) == UserProfileEnum.ADMIN;
        }

        public void Validate(bool isCreateMode)
        {
            // check for email
            User user = FEContext.CurrentContext.GetUserOrDefaultByEmail(this.Email);
            if (user != null && (isCreateMode || (!isCreateMode && user.Id != this.Id)))
                throw new BusinessLogicException(ExceptionCodeEnum.USER_ALREADY_EXISTS);

            if (string.IsNullOrWhiteSpace(this.Firstname))
                throw new BusinessLogicException(ExceptionCodeEnum.USER_FIRSTNAME_REQUIRED);

            if (string.IsNullOrWhiteSpace(this.Lastname))
                throw new BusinessLogicException(ExceptionCodeEnum.USER_LASTNAME_REQUIRED);

            if (isCreateMode && string.IsNullOrWhiteSpace(this.Password))
                throw new BusinessLogicException(ExceptionCodeEnum.USER_PASSWORD_REQUIRED);

            if (string.IsNullOrWhiteSpace(this.Profile))
            {
                throw new BusinessLogicException(ExceptionCodeEnum.USER_PROFILE_REQUIRED);
            }
            else
                if (!EnumHelper.UserProfileMatch(this.Profile))
            {
                throw new BusinessLogicException(ExceptionCodeEnum.INVALID_USER_PROFILE);
            }
        }

        public void ValidatePassword(string password) 
        {
            if (!Regex.Match(password, "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$").Success)
                throw new BusinessLogicException(ExceptionCodeEnum.USER_PASSWORD_WEAK);
        }

        public User GetUser(Guid? userId)
        {
            User user = FEContext.CurrentContext.Users
                .Where(x => x.Id == userId && !x.Deleted)
                .SingleOrDefault();
            if (user == null)
                throw new BusinessLogicException(ExceptionCodeEnum.USER_NOT_FOUND);
            return user;
        }

        public void Destroy()
        {
            this.Deleted = true;
        }
    }
}
