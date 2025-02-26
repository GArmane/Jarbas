﻿using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using serverTCC.Data;
using serverTCC.Models;

namespace serverTCC
{
    public class Startup
    {
        public IConfigurationRoot Configuration;
        public IHostingEnvironment Environment;

        public Startup(IHostingEnvironment env)
        {
            Configuration = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.Development.json")
                .AddJsonFile("appsettings.Production.json")
                .Build();

            Environment = env;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddResponseCompression();
            services.AddCors();

            // Add framework services.
            services.AddMvc();

            //Configuração do Identity
            services.AddIdentity<Usuario, IdentityRole>(opts =>
            {
                //Regra de email
                opts.User.RequireUniqueEmail = true;

                //Regras para as senhas (DEFINIR QUAIS SÃO)
                opts.Password.RequireNonAlphanumeric = false;
                opts.Password.RequireUppercase = false;
                opts.Password.RequireLowercase = false;
                opts.Password.RequiredLength = 0;
                opts.Password.RequireDigit = false;
            })
            .AddEntityFrameworkStores<JarbasContext>();

            string connectionString;

            if (Environment.IsDevelopment())
            {
                connectionString = Configuration.GetConnectionString("JarbasBDDev");
            }
            else
            {
                connectionString = Configuration.GetConnectionString("JarbasBD");
            }

            //Cfg Entity Framework + PostgreSQL
            services.AddEntityFrameworkNpgsql()
                .AddDbContext<JarbasContext>(
                    options => options.UseNpgsql(connectionString));

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory
                .AddConsole(LogLevel.Information)
                .AddDebug();

            app.UseCors(builder =>
                builder.AllowAnyHeader()
                .AllowAnyMethod()
                .AllowAnyOrigin()
            );

            app.UseResponseCompression();

            string authority;

            if (Environment.IsDevelopment())
            {
                authority = "http://localhost:5000";
            }
            else
            {
                authority = "http://identityservertcc.azurewebsites.net";
            }

            //para realizar a autenticação
            app.UseIdentityServerAuthentication(new IdentityServerAuthenticationOptions
            {
                Authority = authority,
                RequireHttpsMetadata = false,

                ApiName = "jarbasApi"
            });


            app.UseMvcWithDefaultRoute();

            //Para adicionar a moeda Real no BD, caso ela não exista
            MoedaSeed.Seed(app);
        }
    }
}
