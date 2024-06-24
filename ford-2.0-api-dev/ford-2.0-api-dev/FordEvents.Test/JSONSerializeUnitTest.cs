using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;

namespace FordEvents.Test
{
    [TestClass]
    public class JSONSerializeUnitTest
    {
        [TestMethod]
        public void SerializeNullObject()
        {

            var result = JsonConvert.SerializeObject(null);
        }
    }
}
