﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookCatalog.Common.BindingModels.Authentication
{
    public class RefreshTokenBindingModel
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
    }
}