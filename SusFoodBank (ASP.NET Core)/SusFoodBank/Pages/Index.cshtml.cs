using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SusFoodBank.Models;

namespace SusFoodBank.Pages
{
	public class IndexModel : PageModel
	{
		private readonly ILogger<IndexModel> _logger;

		public string email { get; set; }

		private UserManager<ApplicationUser> UserManager { get; }

		private SignInManager<ApplicationUser> SignInManager { get; }

		public IndexModel(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
		{
			this.UserManager = userManager;
			this.SignInManager = signInManager;
		}

		public void OnGet()
		{

		}

		//public async Task<IActionResult> OnPostDeleteAccAsync()
		//{
		//    var user = userManager.FindByNameAsync(User?.Identity?.Name).Result;
		//    var result = await userManager.DeleteAsync(user);
		//    if (result.Succeeded)
		//    {
		//        await signInManager.SignOutAsync();
		//        return Redirect("/usermanagement/Login");
		//    }
		//    return Redirect("/");
		//}
	}
}