﻿using BookCatalog.Common.BindingModels.Book;
using BookCatalog.WebBlz.Helpers;
using BookCatalog.WebBlz.Services;
using BookCatalog.WebBlz.Services.Interfaces;
using Microsoft.AspNetCore.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalog.WebBlz.Pages.Book
{
    public partial class BookCreate : IDisposable
    {
        readonly BookEditBindingModel _book = new();
        List<CategoryBindingModel> _categories = new();
        
        [Inject]
        IBookHttpRepository Repository { get; set; }

        [Inject]
        NavigationManager Navigation { get; set; }

        [Inject]
        public HttpInterceptorService Interceptor { get; set; }

        protected async override Task OnInitializedAsync()
        {
            Interceptor.RegisterEvent();
            await GetCategories();
            _book.Read = BooleanString.False;
        }

        private async Task Create()
        {
            await Repository.CreateBook(_book);
            Navigation.NavigateTo("/book");
        }

        private void CancelUpdate()
        {
            Navigation.NavigateTo("/book");
        }

        private async Task GetCategories()
        {
            var response = await Repository.GetCategories();
            _categories = response?.Items?.ToList();
        }

        private void CategoryChanged(int? selected)
        {
            _book.CategoryId = selected; 
        }

        public void Dispose() => Interceptor.DisposeEvent();
    }
}
