using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Utils
{
    public abstract class GuestQREncryptionHelper
    {

        public static string Encrypt(string text)
        {

            TripleDESCryptoServiceProvider desProvider = new TripleDESCryptoServiceProvider();
            MD5CryptoServiceProvider md5Provider = new MD5CryptoServiceProvider();

            desProvider.Key = md5Provider.ComputeHash(UTF8Encoding.UTF8.GetBytes("hello"));
            desProvider.IV = UTF8Encoding.UTF8.GetBytes("12345678");
            desProvider.Mode = CipherMode.ECB;
            ICryptoTransform desEncrypt = desProvider.CreateEncryptor();
            byte[] buffer = UTF8Encoding.UTF8.GetBytes(text);

            byte[] tdesBytes = desEncrypt.TransformFinalBlock(buffer, 0, buffer.Length);
            return Convert.ToBase64String(tdesBytes);
        }
    }
}