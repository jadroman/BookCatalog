using Blazored.LocalStorage;
using BookCatalog.WebBlz.Auth;
using BookCatalog.WebBlz.HttpRepository;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Toolbelt.Blazor.Extensions.DependencyInjection;

namespace BookCatalog.WebBlz
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebAssemblyHostBuilder.CreateDefault(args);
            builder.RootComponents.Add<App>("#app");

            builder.Services.AddHttpClient("BookCatalogAPI", (sp, cl) =>
            {
                cl.BaseAddress = new Uri("http://localhost:5000/api/");
                cl.EnableIntercept(sp);
            });

            // TODO: move url to config file
            //builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri("http://localhost:5000/api/") });
            builder.Services.AddScoped(
                sp => sp.GetService<IHttpClientFactory>().CreateClient("BookCatalogAPI"));
            builder.Services.AddScoped<HttpInterceptorService>();
            builder.Services.AddScoped<ICategoryHttpRepository, CategoryHttpRepository>();
            builder.Services.AddScoped<IBookHttpRepository, BookHttpRepository>(); 
            builder.Services.AddScoped<AuthenticationStateProvider, AuthStateProvider>();
            builder.Services.AddBlazoredLocalStorage();
            builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
            builder.Services.AddHttpClientInterceptor();
            builder.Services.AddAuthorizationCore();
            await builder.Build().RunAsync();
        }
    }
}
