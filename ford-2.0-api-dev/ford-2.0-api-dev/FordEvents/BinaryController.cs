using FordEvents.Services;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Net.Http;
using System.Net;
using Microsoft.AspNetCore.Authorization;
using System.Drawing;

namespace FordEvents
{
    [ApiController]
    [Route("[controller]")]
    public class BinaryController : ControllerBase
    {
        private GuestServices _guestServices;

        public BinaryController(GuestServices guestServices)
        {
            this._guestServices = guestServices;
        }
        
        [HttpGet, Route("guest/qr-data/{guestId}")]
        [Produces("image/png")]
        public IActionResult GetQrData(long? guestId)
        {
            Bitmap bitmap = _guestServices.getQRData(guestId);

            byte[] byteArray = new byte[0];
            if (bitmap != null)
            {
                using (MemoryStream stream = new MemoryStream())
                {
                    bitmap.Save(stream, System.Drawing.Imaging.ImageFormat.Png); // Puedes cambiar el formato si lo deseas
                    byteArray = stream.ToArray();
                }
            }

            return File(byteArray, "image/png");
        }
    }
}
