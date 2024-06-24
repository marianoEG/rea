using FordEvents.Common.Data.TermsAndConditions;
using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Services;
using FordEvents.Model.FordEventsDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Services
{
    public class TermsAndConditionsServices: BaseServices
    {
        public TermsAndConditionsServices(CurrentUserService currentUserService) : base(currentUserService) { }

        public TermsAndConditionsData GetLastestTermsAndConditions()
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                return context.GetLatestTermsAndConditions()
                    .ToData<TermsAndConditionsData>();
            }

        }

        public TermsAndConditionsData CreateTermsAndConditions(TermsAndConditionsData termsAndConditionsData)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                TermsAndCondition _termsAndConditions = new TermsAndCondition();
                _termsAndConditions.Text = termsAndConditionsData.Text;
                _termsAndConditions.Version = termsAndConditionsData.Version;
                context.TermsAndConditions.Add(_termsAndConditions);
                context.SaveChanges();

                return _termsAndConditions.ToData<TermsAndConditionsData>();
            }
        }

    }
}
