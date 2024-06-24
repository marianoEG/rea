using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using FordEvents.Common.Data;
using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;

namespace FordEvents.API.Middlewares
{
    public class HandleExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<HandleExceptionMiddleware> _logger;
        public HandleExceptionMiddleware(RequestDelegate next, ILogger<HandleExceptionMiddleware> logger)
        {
            _logger = logger;
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (BusinessLogicException ble)
            {
                _logger.LogError($"A new Business Logic Exception has been thrown: {ble}");
                await HandleExceptionAsync(httpContext, ble);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Something went wrong: {ex}");
                await HandleExceptionAsync(httpContext, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            Exception innerExc = exception;
            while (innerExc.InnerException != null)
                innerExc = innerExc.InnerException;

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = 500;

            ExceptionCodeEnum code = innerExc switch
            {
                BusinessLogicException => ((BusinessLogicException)innerExc).Code,
                _ => ExceptionCodeEnum.UNHANDLE_ERROR
            };

            ErrorData errorData = new ErrorData
            {
                Code = code.ToString(),
                Message = code.ToShortDescription(),
                Detail = innerExc.Message
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(errorData));
        }
    }
}
