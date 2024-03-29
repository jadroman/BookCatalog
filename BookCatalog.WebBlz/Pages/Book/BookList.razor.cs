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

namespace BookCatalog.WebBlz.Pages.Book
{
    public partial class BookList : IDisposable
    {
        bool _isLoading = true;
        readonly string _placeholderSearchTitle = "Search by title";
        readonly string _placeholderSearchAuthor = "Search by author";
        readonly string _placeholderSearchNote = "Search by note";
        PagedBindingEntity<BookBindingModel> _response;
        PagingMetaData _pagingMetaData = new();
        List<BookBindingModel> _bookList = new();
        BookParameters _bookParameters = new();
        Search _searchByAuthor, _searchByTitle, _searchByNote;
        YesNoModal _yesNoModal;

        [Inject]
        IBookHttpRepository Repository { get; set; }

        [Inject]
        public HttpInterceptorService Interceptor { get; set; }


        protected async override Task OnInitializedAsync()
        {
            Interceptor.RegisterEvent();
            await GetBooks();
        }

        private async Task ResetSearch()
        {
            _searchByTitle.Clear();
            _searchByNote.Clear();
            _searchByAuthor.Clear();

            _bookParameters.Title = string.Empty;
            _bookParameters.Note = string.Empty;
            _bookParameters.Author = string.Empty;
            _bookParameters.PageNumber = 0;
            await GetBooks();
        }

        private void DeleteBook(int id)
        {
            _yesNoModal.Show($@"Are you sure you want to delete ""{GetBookTitleById(id)}"" book?", id);
        }

        private string GetBookTitleById(int id)
        {
            string bookTitle = "";
            if (_bookList != null && _bookList.Count > 0)
            {
                bookTitle = _bookList.Where(c => c.Id == id).FirstOrDefault().Title;
            }

            return bookTitle;
        }

        public async Task BookDeletionConfirmed(object id)
        {
            await Repository.DeleteBook(Convert.ToInt32(id));
            await GetBooks();
        }

        private async Task GetBooks()
        {
            _response = await Repository.GetBooks(_bookParameters);
            _isLoading = false;

            _bookList = _response?.Items?.ToList();
            _pagingMetaData = _response?.MetaData;

        }

        private async Task SelectedPage(int page)
        {
            _bookParameters.PageNumber = page;
            await GetBooks();
        }

        private async Task SearchTitleChanged(string searchTerm)
        {
            _bookParameters.PageNumber = 0;
            _bookParameters.Title = searchTerm;
            await GetBooks();
        }

        private async Task SearchAuthorChanged(string searchTerm)
        {
            _bookParameters.PageNumber = 0;
            _bookParameters.Author = searchTerm;
            await GetBooks();
        }

        private async Task SearchNoteChanged(string searchTerm)
        {
            _bookParameters.PageNumber = 0;
            _bookParameters.Note = searchTerm;
            await GetBooks();
        }

        public void Dispose() => Interceptor.DisposeEvent();
    }
}
