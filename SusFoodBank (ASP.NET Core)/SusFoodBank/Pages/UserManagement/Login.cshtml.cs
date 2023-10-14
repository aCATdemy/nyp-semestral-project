using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.IdentityModel.Tokens;
using SusFoodBank.Models;

namespace SusFoodBank.Pages.UserManagement
{
	public class LoginModel : PageModel
	{
		[BindProperty]
		public Login LModel { get; set; } = new();


		private UserManager<ApplicationUser> UserManager;
		private MyDbContext MyDbContext;

		private readonly SignInManager<ApplicationUser> signInManager;
		public LoginModel(SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager, MyDbContext myDbContext)

		{
			this.signInManager = signInManager;
			this.UserManager = userManager;
			this.MyDbContext = myDbContext;
		}
		public void OnGet()
		{
		}
		public async Task<IActionResult> OnPostAsync()
		{
			if (1 == 1)
			{
				var identityResult = await signInManager.PasswordSignInAsync(LModel.Email, LModel.Password,
				LModel.RememberMe, false);
				var info = new Analytics { };
				var context = MyDbContext;

				var list = context.Analytics.ToList();

				if (identityResult.Succeeded)
				{
					var result = await UserManager.FindByEmailAsync(LModel.Email);


					if (result.Suspended || result.Deleted == true)
					{
						ModelState.AddModelError(string.Empty, "Account Suspended/Deleted please contact admin");
						await signInManager.SignOutAsync();
						return Page();
					}

					var trackingdata = new loginlist { };
					trackingdata.ApplicationUser = UserManager.FindByNameAsync(LModel.Email).Result;
					context.loginlist.Add(trackingdata);

					if (list.IsNullOrEmpty())
					{
						info.ApplicationUser = result;
						info.LoginCount++;
						context.Analytics.Add(info);
						context.SaveChanges();
					}
					else
					{
						foreach (var item in list)
						{
							if (item.ApplicationUser?.Id == result.Id)
							{
								var analytic = context.Analytics.First(b => b.ApplicationUser.Email == LModel.Email);
								analytic.LoginCount++;

								context.SaveChanges();
								break;
							}
							else
							{
								info.ApplicationUser = result;
								info.LoginCount++;
								context.Analytics.Add(info);
								context.SaveChanges();
							}
						}
					}
					return Redirect("/");
				}
				foreach (var item in list)
				{
					if (item.ApplicationUser?.Email == LModel.Email)
					{
						using (var data = context)
						{
							var analytic = context.Analytics
								.Single(b => b.ApplicationUser.Email == LModel.Email);
							analytic.FailedLogin++;

							context.SaveChanges();
						}

					}
				}

				ModelState.AddModelError(string.Empty, "Username or Password incorrect");


			}
			return Page();
		}
		public IActionResult OnForgotPass(string id)
		{
			return RedirectToPage("forgetpass");
		}
	}
}
