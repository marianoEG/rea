﻿using System;
using System.Collections.Generic;

#nullable disable

namespace FordEvents.Model.FordEventsDB
{
    public partial class Configuration
    {
        public long Id { get; set; }
        public string Key { get; set; }
        public string Value { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime? CreatedOn { get; set; }
        public Guid? ModifiedBy { get; set; }
        public Guid? CreatedBy { get; set; }
        public bool Deleted { get; set; }
    }
}
