using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Transfer;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Services
{
    public class AWSAmazonS3Service
    {
        private readonly string BucketBaseUrl;
        private readonly string BucketName;
        private readonly RegionEndpoint BucketRegion;
        private readonly BasicAWSCredentials AwsCredentials;

        public AWSAmazonS3Service()
        {
            BucketBaseUrl = AppSettings.AmazonS3BucketBaseUrl;
            BucketName = AppSettings.AmazonS3BucketName;
            BucketRegion = RegionEndpoint.USEast1;
            AwsCredentials = new BasicAWSCredentials(AppSettings.AmazonS3BucketAccessKey, AppSettings.AmazonS3BucketSecretKey);
        }

        public string UploadFileFromLocalPath(string filePath)
        {
            FileInfo fileInfo = new FileInfo(filePath);
            if (!fileInfo.Exists)
                throw new Exception("No existe el archivo " + filePath);
            string keyName = Guid.NewGuid().ToString().Replace("-", "") + fileInfo.Extension;
            AmazonS3Client s3Client = new AmazonS3Client(AwsCredentials, BucketRegion);
            new TransferUtility(s3Client).UploadAsync(fileInfo.FullName, BucketName, keyName).Wait();
            return BucketBaseUrl + "/" + BucketName + "/" + keyName;
        }

        public async Task<string> UploadFileToS3(IFormFile file)
        {
            using (var client = new AmazonS3Client(AwsCredentials, BucketRegion))
            {
                using (var newMemoryStream = new MemoryStream())
                {
                    file.CopyTo(newMemoryStream);
                    string keyName = Guid.NewGuid().ToString().Replace("-", "") + Path.GetExtension(file.FileName);

                    var uploadRequest = new TransferUtilityUploadRequest
                    {
                        InputStream = newMemoryStream,
                        Key = keyName,
                        BucketName = BucketName,
                        CannedACL = S3CannedACL.PublicRead
                    };

                    var fileTransferUtility = new TransferUtility(client);
                    await fileTransferUtility.UploadAsync(uploadRequest);
                    return BucketBaseUrl + "/" + BucketName + "/" + keyName;
                }
            }
        }

    }
}
