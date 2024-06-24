using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common
{
    public static class AppSettings
    {
        public static string BaseUrlToImages { get; set; }
        public static string WildcardPassword { get; set; }
        public static int JWTExpirationTimeInMinutes { get; set; }
        public static int PageSizeByDefault { get; set; }
        public static string AmazonS3BucketAccessKey { get; set; }
        public static string AmazonS3BucketSecretKey { get; set; }
        public static string AmazonS3BucketBaseUrl { get; set; }
        public static string AmazonS3BucketName { get; set; }
        public static string CampaignUrl { get; set; }
        public static string ImagesFolder { get; set; }
        public static string FilesFolder { get; set; }
        public static string AssetsFolder { get; set; }
        public static string ConnectionTestFile { get; set; }
        public static string CampaignsFolder { get; set; }
        public static int PasswordExpirationDays { get; set; }
        // SaleForce
        public static string saleForceOAuthUrl { get; set; }
        public static string saleForceOAuthGrantType { get; set; }
        public static string saleForceOAuthClientId { get; set; }
        public static string saleForceOAuthClientSecret { get; set; }
        public static string saleForceOAuthAccountId { get; set; }
        public static string saleForceSyncGuestUrl { get; set; }
        public static string guestQRUrl { get; set; }
    }
}
