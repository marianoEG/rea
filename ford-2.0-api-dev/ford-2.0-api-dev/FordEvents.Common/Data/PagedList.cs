using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data
{
    public class PagedList<T>
    {
        private List<T> _listOfEntities;
        public List<T> ListOfEntities
        {
            get
            {
                if (this._listOfEntities == null)
                    this._listOfEntities = new List<T>();
                return this._listOfEntities;
            }
            set
            {
                this._listOfEntities = value;
            }
        }

        public int? TotalItems { get; set; }
        public int? PageSize { get; set; }

        public int TotalPages
        {
            get
            {
                if (this.TotalItems.HasValue && this.PageSize.HasValue)
                    return Convert.ToInt32(Math.Ceiling(((decimal)this.TotalItems.Value / (decimal)this.PageSize.Value)));
                else
                    return 0;
            }
        }

        public int? CurrentPage { get; set; }

        public bool IsValidPage(int pageNumber)
        {
            if (pageNumber <= 0)
                return false;

            if (pageNumber > this.TotalPages)
                return false;

            return true;
        }

        public bool IsLastPage
        {
            get
            {
                return this.CurrentPage == this.TotalPages;
            }
        }
    }
}

