﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookCatalog.Common.BindingModels.Registration
{
    public class UserForRegistrationBindingModel
    {
        [StringLength(56)]
        public string FirstName { get; set; }

        [StringLength(56)]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [StringLength(56)]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(56)]
        public string Password { get; set; }

        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }
}
