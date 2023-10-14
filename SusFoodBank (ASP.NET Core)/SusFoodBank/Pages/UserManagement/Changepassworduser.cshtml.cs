using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SusFoodBank.Models;

namespace SusFoodBank.Pages.UserManagement
{
	[Authorize]
    public class ChangepassworduserModel : PageModel
    {
		[BindProperty]
		public Changepassworduser Changepassworduser { get; set; } = new Changepassworduser();
		public string? email { get; set; }
		public string? username { get; set; }

		private UserManager<ApplicationUser> userManager { get; }

		private SignInManager<ApplicationUser> signInManager { get; }

		public ChangepassworduserModel(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
		{
			this.userManager = userManager;
			this.signInManager = signInManager;
		}
		public void OnGet()
		{

			string page = HttpContext.Request.Query["Id"].ToString();
			if (page == string.Empty)
			{
				var user = userManager.FindByNameAsync(User?.Identity?.Name).Result;
				email = user.Email;
				username = user.UserName;
			}
			else
			{
				var pageresult = userManager.FindByIdAsync(page).Result;
				email = pageresult.Email;
				username = pageresult.UserName;
			}

		}
		public async Task<IActionResult> OnPostAsync()
		{

			if (ModelState.IsValid)
			{

				var user = new ApplicationUser();
				string page = HttpContext.Request.Query["Id"].ToString();
				if (page == string.Empty)
				{
					try
					{
						var object1 = userManager.FindByNameAsync(User?.Identity?.Name).Result;
						page = object1.Id;
						user = userManager.FindByIdAsync(page).Result;
					}
					catch
					{
						return Redirect("/");
					}

				}
				else
				{
					user = await userManager.FindByIdAsync(page);
				}

				var token = await userManager.GeneratePasswordResetTokenAsync(user);

				var result = await userManager.ChangePasswordAsync(user, Changepassworduser.oldpassword,Changepassworduser.newpassword);


				if (result.Succeeded)
				{
					return Redirect("/");
				}

				foreach (var error in result.Errors)
				{
					ModelState.AddModelError("", error.Description);
				}
			}
			return Page();
		}
	}
}
