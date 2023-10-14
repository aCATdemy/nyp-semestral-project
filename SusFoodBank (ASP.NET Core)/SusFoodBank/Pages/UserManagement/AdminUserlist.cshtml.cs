using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SusFoodBank.Models;

namespace SusFoodBank.Pages.UserManagement
{
	[Authorize(Roles = "Admin")]
	public class AdminUserlistModel : PageModel
	{

		[BindProperty]
		public List<ApplicationUser>? Allusers { get; set; }
		private UserManager<ApplicationUser> userManager { get; }

		private SignInManager<ApplicationUser> signInManager { get; }

		public AdminUserlistModel(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
		{
			this.userManager = userManager;
			this.signInManager = signInManager;
		}
		public void OnGet()
		{
			Allusers = userManager.Users.ToList();
		}
		public async Task<IActionResult> OnPostDeleteAccAsync(string id)
		{
			var user = userManager.FindByIdAsync(id).Result;
			user.Deleted = true;
			var result = await userManager.UpdateAsync(user);
			if (result.Succeeded)
			{
				return Redirect("/usermanagement/AdminUserlist");
			}
			return Redirect("/");
		}
		public async Task<IActionResult> OnPostUnDeleteAccAsync(string id)
		{
			var user = userManager.FindByIdAsync(id).Result;
			user.Deleted = false;
			var result = await userManager.UpdateAsync(user);
			if (result.Succeeded)
			{
				return Redirect("/usermanagement/AdminUserlist");
			}
			return Redirect("/");
		}
		public async Task<IActionResult> OnPostSuspendAsync(string id)
		{
			var user = userManager.FindByIdAsync(id).Result;
			user.Suspended = true;
			var result = await userManager.UpdateAsync(user);
			if (result.Succeeded)
			{
				return Redirect("/usermanagement/AdminUserlist");
			}
			return Redirect("/");
		}
		public async Task<IActionResult> OnPostUnsuspendAsync(string id)
		{
			var user = userManager.FindByIdAsync(id).Result;
			user.Suspended = false;
			var result = await userManager.UpdateAsync(user);
			if (result.Succeeded)
			{
				return Redirect("/usermanagement/AdminUserlist");
			}
			return Redirect("/");
		}
		public void OnPostUpdateAcc(string id)
		{
			Response.Redirect($"/usermanagement/Update?Id={id}");
		}

		//add new page to change password using admin
		public void OnPostChangePassword(String id)
		{
			Response.Redirect($"/usermanagement/Changepassword?ID={id}");
		}

	}
}
