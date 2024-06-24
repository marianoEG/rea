using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IronOcr;

namespace FordEvents.Test
{
    [TestClass]
    public class TextRecognitionTest
    {
        [TestMethod]
        public void DNITest()
        {
            string imagePath = @"C:\Temp\DNI-front-1.jpg";
            var ocr = new IronTesseract();
            using (var input = new OcrInput(imagePath, new IronSoftware.Drawing.CropRectangle(0, 0, 1000, 587, IronSoftware.Drawing.MeasurementUnits.Pixels)))
            {
                var result = ocr.Read(input);
                Console.WriteLine(result.ToString());
                Console.ReadLine();
            }
        }
    }
}
