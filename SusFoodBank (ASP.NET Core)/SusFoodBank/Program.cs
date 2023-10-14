using Microsoft.AspNetCore.Identity;
using SusFoodBank;
using SusFoodBank.Models;
using SusFoodBank.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

builder.Services.AddDbContext<MyDbContext>();
builder.Services.AddAuthorization();
builder.Services.AddIdentity<ApplicationUser, IdentityRole>().AddEntityFrameworkStores<MyDbContext>().AddTokenProvider<DataProtectorTokenProvider<ApplicationUser>>(TokenOptions.DefaultProvider); ;
builder.Services.AddScoped<LocationService>();
builder.Services.Configure<IdentityOptions>(options =>
{
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromSeconds(60);
    options.Lockout.MaxFailedAccessAttempts = 3;
    options.Lockout.AllowedForNewUsers = true;
});

builder.Services.ConfigureApplicationCookie(Config =>
{
    Config.LoginPath = "/UserManagement/Login";
});

builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddDistributedMemoryCache(); //save session in memory
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(100);
    options.Cookie.IsEssential = true;
});

builder.Services.AddDbContext<MyDbContext>();
builder.Services.AddScoped<FoodService>();
builder.Services.AddScoped<QuestionService>();
builder.Services.AddScoped<ItemService>();

// Appointment:
builder.Services.AddScoped<BookingService>();
builder.Services.AddScoped<SlotService>();
builder.Services.AddScoped<SlotSessionService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseStatusCodePagesWithRedirects("/Error/{0}");

app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();
app.UseSession();
app.MapRazorPages();

app.Run();
