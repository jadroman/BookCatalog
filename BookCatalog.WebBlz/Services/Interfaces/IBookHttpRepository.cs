﻿using BookCatalog.Common.BindingModels;
using BookCatalog.Common.BindingModels.Book;
using BookCatalog.Common.Helpers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookCatalog.WebBlz.Services.Interfaces
{
    public interface IBookHttpRepository
    {
        Task<PagedBindingEntity<BookBindingModel>> GetBooks(BookParameters parameters); 
        Task CreateBook(BookEditBindingModel book);
        Task<BookEditBindingModel> GetBook(int id);
        Task UpdateBook(BookEditBindingModel book);
        Task DeleteBook(int id);
        Task<PagedBindingEntity<CategoryBindingModel>> GetCategories();
    }
}
