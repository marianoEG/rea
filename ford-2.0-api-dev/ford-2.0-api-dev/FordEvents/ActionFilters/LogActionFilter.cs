
using FordEvents.Common.Services;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics;
using System.Text;

namespace FordEvents.API.ActionFilters
{
    public class LogActionFilter : IActionFilter
    {

        private ILogger<LogActionFilter> _logger;
        private CurrentUserService _currentUserService;
        private Stopwatch TimerWatch { get; set; }

        public LogActionFilter(ILogger<LogActionFilter> logger, CurrentUserService currentUserService)
        {
            _logger = logger;
            _currentUserService = currentUserService;
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            this.TimerWatch = Stopwatch.StartNew();
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            try
            {
                if (this.TimerWatch != null)
                {
                    this.TimerWatch.Stop();
                    StringBuilder text = new StringBuilder();

                    text.AppendFormat("ServiceName: {0},", context.HttpContext.Request.Path.Value);
                    text.Append(Environment.NewLine);
                    foreach (var header in context.HttpContext.Request.Headers)
                    {
                        text.AppendFormat("Header: {0}, value: {1}';' ", header.Key, header.Value);
                    }
                    text.Append(Environment.NewLine);
                    text.AppendFormat("UserId: {0},", _currentUserService.GetUserId()?.ToString());
                    text.Append(Environment.NewLine);
                    text.AppendFormat("Time: {0},", this.TimerWatch.ElapsedMilliseconds);

                    _logger.LogInformation(text.ToString());
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error to Log service analytics", ex);
            }
        }
    }
}
