﻿using BookCatalog.Common.BindingModels;
using BookCatalog.Common.BindingModels.Book;
using BookCatalog.Common.Helpers;
using BookCatalog.WebBlz.Components;
using BookCatalog.WebBlz.Services;
using BookCatalog.WebBlz.Services.Interfaces;
using BookCatalog.WebBlz.Shared;
using Microsoft.AspNetCore.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalog.WebBlz.Pages.Category
{
    public partial class CategoryList : IDisposable
    {
        bool _isLoading = true;
        string _placeholderSearchText = "Category name";
         PagedBindingEntity<CategoryBindingModel> _response;
        PagingMetaData _pagingMetaData = new();
        List<CategoryBindingModel> _categoryList = new();
        Search _searchByName;
        CategoryParameters _categoryParameters = new();
        YesNoModal _yesNoModal;

        [Inject]
        ICategoryHttpRepository Repository { get; set; }

        [Inject]
        public HttpInterceptorService Interceptor { get; set; }

        protected async override Task OnInitializedAsync()
        {
            Interceptor.RegisterEvent();
            await GetCategories();
        }

        private async Task ResetSearch()
        {
            _searchByName.Clear();
            _categoryParameters.Name = string.Empty;
            _categoryParameters.PageNumber = 0;
            await GetCategories();
        }

        private void DeleteCategory(int id)
        {
            _yesNoModal.Show($@"Are you sure you want to delete ""{GetCategoryNameById(id)}"" category?", id);
        }

        private string GetCategoryNameById(int id)
        {
            string catName = "";
            if (_categoryList != null && _categoryList.Count > 0)
            {
                catName = _categoryList.Where(c => c.Id == id).FirstOrDefault().Name;
            }

            return catName;
        }

        public async Task CategoryDeletionConfirmed(object id)
        {
            await Repository.DeleteCategory(Convert.ToInt32(id));
            await GetCategories();
        }

        private async Task GetCategories()
        {
            _response = await Repository.GetCategories(_categoryParameters);
            _isLoading = false;
            _categoryList = _response?.Items?.ToList();
            _pagingMetaData = _response?.MetaData;
        }

        private async Task SelectedPage(int page)
        {
            _categoryParameters.PageNumber = page;
            await GetCategories();
        }
        private async Task SearchChanged(string searchTerm)
        {
            _categoryParameters.PageNumber = 0;
            _categoryParameters.Name = searchTerm;
            await GetCategories();
        }

        public void Dispose() => Interceptor.DisposeEvent();
    }
}
