using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data
{
    public class UserData
    {
        public Guid? Id { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string Profile { get; set; }
        public DateTime ExpirationDate { get; set; }
    }
}