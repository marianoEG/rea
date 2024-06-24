using System;
using System.Linq;
using FordEvents.Common.Enums;
using FordEvents.Common.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;

namespace FordEvents.Common.Services
{
    public class CurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public Guid? GetUserId()
        {
            string userId = GetClaimValueByName<string>(JWTHelper.USER_ID);
            if (string.IsNullOrEmpty(userId))
                return null;
            return Guid.Parse(userId);
        }

        public UserProfileEnum? GetProfile()
        {
            string profile = GetClaimValueByName<string>(JWTHelper.PROFILE);
            return EnumHelper.ToUserProfile(profile);
        }

        public bool IsAdmin()
        {
            UserProfileEnum? profile = GetProfile();
            return profile.HasValue ? profile.Value == UserProfileEnum.ADMIN : false;
        }

        public bool IsReadOnly()
        {
            UserProfileEnum? profile = GetProfile();
            return profile.HasValue ? profile.Value == UserProfileEnum.READONLY : false;
        }


        public DateTime GetStartDate()
        {
            return GetClaimValueByName<DateTime>(JWTHelper.START_DATE);
        }

        public DateTime GetExpirationDate()
        {
            return GetClaimValueByName<DateTime>(JWTHelper.EXPIRATION_DATE);
        }

        #region Private Methods
        private T GetClaimValueByName<T>(string claimName)
        {
            return string.IsNullOrEmpty(GetClaimValueByName(claimName))
                ? default
                : (T)Convert.ChangeType(GetClaimValueByName(claimName), typeof(T));
        }

        private string GetClaimValueByName(string claimName)
        {
            return _httpContextAccessor?.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == claimName)?.Value;
        }
        #endregion
    }
}
