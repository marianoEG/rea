using FordEvents.Common.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Exceptions
{
    public class BusinessLogicException : Exception
    {
        //public CodeMessage;

        public ExceptionCodeEnum Code { get; set; }

        public BusinessLogicException(ExceptionCodeEnum code) : base()
        {
            this.Code = code;
        }

        public BusinessLogicException(ExceptionCodeEnum code, string message) : base(message)
        {
            this.Code = code;
        }
    }
}
