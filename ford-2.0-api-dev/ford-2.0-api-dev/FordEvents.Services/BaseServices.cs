using FordEvents.Common.Services;
using FordEvents.Model.FordEventsDB;
using System;

namespace FordEvents.Services
{
    public abstract class BaseServices
    {
        protected CurrentUserService _currentUserService;

        protected FEContext GetCurrentContext()
        {
            return FEContext.GetInstance(this._currentUserService);
        }

        public BaseServices(CurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }
    }
}
