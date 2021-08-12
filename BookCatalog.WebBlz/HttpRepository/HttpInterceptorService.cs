﻿
using Blazored.LocalStorage;
using BookCatalog.WebBlz.Auth;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Authorization;
using System;
using System.Net;
using System.Threading.Tasks;
using Toolbelt.Blazor;

namespace BookCatalog.WebBlz.HttpRepository
{
	public class HttpInterceptorService
	{
		private readonly HttpClientInterceptor _interceptor;
        private readonly AuthenticationStateProvider _authStateProvider;
        private readonly ILocalStorageService _localStorage;
        private readonly NavigationManager _navManager;

        public HttpInterceptorService(HttpClientInterceptor interceptor, AuthenticationStateProvider authStateProvider, ILocalStorageService localStorage, NavigationManager navManager)
		{
			_interceptor = interceptor;
            _authStateProvider = authStateProvider;
            _localStorage = localStorage;
            _navManager = navManager;
        }

		public void RegisterEvent() => _interceptor.AfterSendAsync += InterceptResponse;

		private async Task InterceptResponse(object sender, HttpClientInterceptorEventArgs e)
		{
            if (!e.Response.IsSuccessStatusCode)
            {
                var statusCode = e.Response.StatusCode;

                //string message;
                switch (statusCode)
                {
                    case HttpStatusCode.NotFound:
                        _navManager.NavigateTo("/CustomNotFound");
                        break;
                    case HttpStatusCode.Unauthorized:
                        await _localStorage.RemoveItemAsync("authToken");
                        ((AuthStateProvider)_authStateProvider).NotifyUserLogout();
                        e.Request.Headers.Authorization = null;
                        //_client.DefaultRequestHeaders.Authorization = null;
                        break;
                    default:
                        _navManager.NavigateTo("/CustomInternalServerError");
                        throw new ApplicationException(e.Response.ReasonPhrase);
                }
            }
        }

		public void DisposeEvent() => _interceptor.AfterSendAsync -= InterceptResponse;
	}
}
