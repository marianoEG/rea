using Microsoft.AspNetCore.Mvc;
using QRCoder;
using System;
using System.Drawing;
using System.IO;

namespace FordEvents.Common.Utils
{
    public abstract class QRHelper
    {
        public static Bitmap GenerateQRCode(string data)
        {
            try
            {
                // Crea un generador de QR con los datos proporcionados
                QRCodeGenerator qrGenerator = new QRCodeGenerator();
                QRCodeData qRCodeData = qrGenerator.CreateQrCode(data, QRCodeGenerator.ECCLevel.Q);

                // Convierte los datos del QR en una matriz de bytes
                QRCode qrCode = new QRCode(qRCodeData);
                return qrCode.GetGraphic(20);
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
