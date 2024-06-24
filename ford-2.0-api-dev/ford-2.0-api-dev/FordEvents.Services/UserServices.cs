using FordEvents.Common.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Model.FordEventsDB;
using FordEvents.Common.Utils;
using FordEvents.Common.Data;
using FordEvents.Common.Data.User;
using FordEvents.Common;

namespace FordEvents.Services
{
    public class UserServices : BaseServices
    {
        public UserServices(CurrentUserService currentUserService) : base(currentUserService) { }

        public UserData CreateUser(UserCreateData userCreateData)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                User user = new User();
             
                user.Id = Guid.NewGuid();
                user.Firstname = userCreateData.Firstname;
                user.Lastname = userCreateData.Lastname;
                user.Email = userCreateData.Email;
                user.ValidatePassword(userCreateData.Password);
                user.Password = EncryptionHelper.Encrypt(userCreateData.Password);

                // Cuando se crea un usuario la password está expirada para que le pida setear una nueva apenas ingresa.
                user.ExpirationDate = DateTime.UtcNow.AddDays(-1);

                user.Profile = userCreateData.Profile;
                user.Validate(true);
                context.Users.Add(user);
                context.SaveChanges();
            
                return user.ToData<UserData>();
            }
        }

        public UserData EditUser(UserData userData)
        {
            using (var context = this.GetCurrentContext())
            {
               if (!_currentUserService.IsAdmin())
                   throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                User user = context.GetUserById(userData.Id);
                user.Firstname = userData.Firstname;
                user.Lastname = userData.Lastname;
                user.Email = userData.Email;
                user.Profile = userData.Profile;
                user.Validate(false);
                context.SaveChanges();

                return user.ToData<UserData>();
            }
        }

        public PagedList<UserData> GetUsersList(int? pageNumber, int? pageSize, string searchText) 
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                string filter = string.IsNullOrWhiteSpace(searchText) ? "" : searchText.Trim().ToLower();
                IQueryable<User> query = context.Users
                    .Where(x =>
                        !x.Deleted
                        &&
                        (x.Firstname.ToLower().Contains(filter) || x.Lastname.ToLower().Contains(filter) || x.Email.ToLower().Contains(filter))
                    );

                PagedList<UserData> result = new PagedList<UserData>();
                result.ListOfEntities = query.Paginate(pageNumber, pageSize).ToList<object>().ToDataList<UserData>();
                result.CurrentPage = pageNumber;
                result.PageSize = pageSize;
                result.TotalItems = query.Count();
                return result;
            }
        }

        public UserData GetUser(Guid userId)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                return context.GetUserById(userId)
                    .ToData<UserData>();
            }
        }

        public void DeleteUser(Guid userId)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                context.GetUserById(userId).Destroy();
                context.SaveChanges();

            }
        }

        public void updatePassword(UserChangePassData changePassData)
        {
            using (var context = this.GetCurrentContext())
            {
                User user = context.GetUserByEmail(changePassData.Email);
                user.ValidatePassword(changePassData.Password);
                string encryptedNewPass = EncryptionHelper.Encrypt(changePassData.Password);

                if (encryptedNewPass == user.Password) {
                    throw new BusinessLogicException(ExceptionCodeEnum.USER_PASSWORD_CANT_BE_EQUAL);
                }

                user.ExpirationDate = DateTime.UtcNow.AddDays(AppSettings.PasswordExpirationDays);
                user.Password = encryptedNewPass;

                context.SaveChanges();
            }
        }

    }
}
