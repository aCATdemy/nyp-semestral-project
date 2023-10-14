using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SusFoodBank.Models;

namespace SusFoodBank.Pages.UserManagement
{
	public class RegisterModel : PageModel
	{
		private UserManager<ApplicationUser> userManager { get; }
		private SignInManager<ApplicationUser> signInManager { get; }

		private RoleManager<IdentityRole> roleManager;

		private IWebHostEnvironment _environment;

		[BindProperty]
		public Register RModel { get; set; } = new();
		[BindProperty]
		public IFormFile? Upload { get; set; }
		private MyDbContext MyDbContext;
		public string[] Genders { get; set; } = new[] { "Male", "Female", "Unspecified" };
		public RegisterModel(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IWebHostEnvironment environment, RoleManager<IdentityRole> roleManager, MyDbContext myDbContext)
		{
			this.userManager = userManager;
			this.signInManager = signInManager;
			_environment = environment;
			this.roleManager = roleManager;
			MyDbContext = myDbContext;
		}
		public void OnGet()
		{
		}
		public async Task<IActionResult> OnPostAsync()
		{
			if (ModelState.IsValid)
			{
				var URL = "";
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
					URL = string.Format("/{0}/{1}", uploadsFolder,
					imageFile);
				}

				var user = new ApplicationUser()
				{
					UserName = RModel.Email,
					Email = RModel.Email,
					FullName = RModel.FullName,
					Gender = RModel.Gender,
					ImageURL = URL
				};

				IdentityRole role = await roleManager.FindByIdAsync("Admin");
				if (role == null)
				{
					IdentityResult result2 = await roleManager.CreateAsync(new IdentityRole("Admin"));
					if (!result2.Succeeded)
					{
						ModelState.AddModelError("", "Create role admin failed");
					}
				}

				IdentityRole role2 = await roleManager.FindByIdAsync("Admin");
				if (role2 == null)
				{
					IdentityResult result3 = await roleManager.CreateAsync(new IdentityRole("User"));
					if (!result3.Succeeded)
					{
						ModelState.AddModelError("", "Create role user failed");
					}
				}

				var result = await userManager.CreateAsync(user, RModel.Password);
				if (result.Succeeded)
				{
					result = await userManager.AddToRoleAsync(user, "User");
					await signInManager.SignInAsync(user, false);
					var context = MyDbContext;
					var info = new Analytics { };
					var loginlist = new loginlist { };
					var list = context.Analytics.ToList();
					//add information   
					info.ApplicationUser = user;
					info.LoginCount++;

					loginlist.ApplicationUser = user;
					context.Analytics.Add(info);
					context.loginlist.Add(loginlist);
					context.SaveChanges();

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
