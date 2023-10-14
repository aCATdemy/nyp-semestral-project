using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SusFoodBank.Models;

namespace SusFoodBank.Pages.UserManagement
{
	[Authorize]
	public class UpdateModel : PageModel
	{
		[BindProperty]
		public Update Update { get; set; } = new();
		[BindProperty]
		public IFormFile? Upload { get; set; }
		public string? email { get; set; }
		public string? username { get; set; }
		public string? IMGURL { get; set; }

		private UserManager<ApplicationUser> userManager { get; }

		private SignInManager<ApplicationUser> signInManager { get; }

		private IWebHostEnvironment _environment;

		public UpdateModel(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IWebHostEnvironment _environment)
		{
			this.userManager = userManager;
			this.signInManager = signInManager;
			this._environment = _environment;
		}
		public void OnGet()
		{
			var user = userManager.FindByNameAsync(User?.Identity?.Name).Result;
			string page = HttpContext.Request.Query["Id"].ToString();
			if (page == string.Empty)
			{
				email = user.Email;
				username = user.UserName;
				IMGURL = user.ImageURL;
			}
			else
			{
				var pageresult = userManager.FindByIdAsync(page).Result;
				email = pageresult.Email;
				username = pageresult.UserName;
				IMGURL = user.ImageURL;
			}

		}
		public async Task<IActionResult> OnPostAsync()
		{

			if (ModelState.IsValid)
			{
				string page = HttpContext.Request.Query["Id"].ToString();
				if (page == string.Empty)
				{
					var object1 = userManager.FindByNameAsync(User?.Identity?.Name).Result;
					page = object1.Id;

					var user = userManager.FindByIdAsync(page).Result;
					user.Email = Update.Email;
					user.UserName = Update.Email;
					user.FullName = Update.UserName;

					if (Upload != null)
					{
						//if (Upload.Length > 2 * 1024 * 1024)
						//{
						//	ModelState.AddModelError("Upload",
						//	"File size cannot exceed 2MB.");
						//	return Page();
						//}
						var uploadsFolder = "uploads";
						var imageFile = Guid.NewGuid() + Path.GetExtension(
						Upload.FileName);
						var imagePath = Path.Combine(_environment.ContentRootPath,
						"wwwroot", uploadsFolder, imageFile);
						using var fileStream = new FileStream(imagePath,
						FileMode.Create);
						await Upload.CopyToAsync(fileStream);
						user.ImageURL = string.Format("/{0}/{1}", uploadsFolder,
						imageFile);
					}
					var result = await userManager.UpdateAsync(user);



					if (result.Succeeded)
					{
						await signInManager.SignInAsync(user, false);
						return Redirect("/");
					}
					foreach (var error in result.Errors)
					{
						ModelState.AddModelError("", error.Description);
					}

				}
				else
				{

					var user = userManager.FindByIdAsync(page).Result;
					user.Email = Update.Email;
					user.UserName = Update.UserName;
					var result = await userManager.UpdateAsync(user);
					//change password not working <-
					//var result2 = await userManager.ChangePasswordAsync(user, Update.OldPassword, Update.Password);


					if (result.Succeeded)
					{
						return Redirect("/");
					}
					foreach (var error in result.Errors)
					{
						ModelState.AddModelError("", error.Description);
					}
				}
			}
			return Page();
		}

	}
}
