using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SusFoodBank.Models;

namespace SusFoodBank.Pages.UserManagement
{
    [Authorize]
    [Authorize(Roles = "User")]
    public class AccountDetailsModel : PageModel


    {
        public string datevalue { get; set; }
        public string datelist { get; set; }
        public string NoLogin { get; set; }
        private UserManager<ApplicationUser> userManager { get; }
        private MyDbContext MyDbContext;

        private SignInManager<ApplicationUser> signInManager { get; }

        public AccountDetailsModel(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, MyDbContext myDbContext)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.MyDbContext = myDbContext;
        }
        public void OnGet()
        {
            var user = userManager.FindByNameAsync(User.Identity.Name).Result;
            var list = MyDbContext.loginlist.ToList();
            var output = MyDbContext.loginlist.Where(i => i.ApplicationUser.Id == user.Id).GroupBy(l => l.Date, l => l, (key, g) => new { Key = key, Count = g.Count() });
            var date1 = new List<string>();
            var date2 = new List<int>();

            foreach (var item in output)
            {
                Console.WriteLine($"{item}");
                date1.Add(item.Key);
                date2.Add(item.Count);

            }
            datelist = System.Text.Json.JsonSerializer.Serialize(date1);
            datevalue = System.Text.Json.JsonSerializer.Serialize(date2);

            var analytics = MyDbContext.Analytics.Where(i => i.ApplicationUser.Id == user.Id).First();
            NoLogin = analytics.LoginCount.ToString();


        }
        public async Task<IActionResult> OnPostDeleteAccAsync()
        {
            var user = userManager.FindByNameAsync(User.Identity.Name).Result;
            user.Deleted = true;
            var result = await userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                await signInManager.SignOutAsync();
                return Redirect("/usermanagement/Login");
            }
            return Redirect("/");
        }


        //link update here as well 



    }
}
