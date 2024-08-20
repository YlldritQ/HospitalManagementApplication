using backend.Core.DbContext;
using backend.Core.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddControllers().
    AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

//DbConfig


builder.Services.AddDbContext<ApplicationDbContext>(options =>

    options.UseSqlServer(builder.Configuration.GetConnectionString("local"))
);

//Dependency Injection


//Add Identity
builder.Services
    AddIdentity< ApplicationUser,IdentityUser > 0
    AddEntityFrameworkStores<ApplicationDbContext>0
    AddDefaultTokenProviders();

//Config Identity
builder.ServicesConfigure<IdentityOptions>(Options =>
{
    Options.Password RequiredLength = 8;
    Options.Password RequiredDigit = false;
    Options.Password RequiredUppercase = false;
    Options.Password RequiredNonAlphanumeric = false;
    Options.Signin RequireConfirmedAccount = false;
    Options.Signin RequireConfirmedEmail = false;
    Options.Signin RequireConfirmedPhoneNumber = false;
});

//AuthenticationSchema and JWT Bearer
builder.Services
    AddAuthentication(Options =>
    {
    Options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    Options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    Options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
 .AddJwtBearer(Options =>
{
    Options.SvaeToken = true;
    Options.RequiredHttpsMetadata = false;
    Options.TokenValidationParameters = new Microsoft IdentityModel Tokens TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = builder.Configuration["JWT:Validissuer"],
        ValidAudience = builder.Configuraton["JWT:ValidAudience"],
        ValidSigningKey = new SymmetircSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"]))
    };
});



// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
