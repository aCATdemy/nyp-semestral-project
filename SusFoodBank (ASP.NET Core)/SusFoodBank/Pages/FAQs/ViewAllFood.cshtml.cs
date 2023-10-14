using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SusFoodBank.Models;
using SusFoodBank.Services;

namespace SusFoodBank.Pages.FAQs
{
	public class ViewAllFoodModel : PageModel
	{
		private UserManager<ApplicationUser> userManager { get; }

		private SignInManager<ApplicationUser> signInManager { get; }
		private readonly RoleManager<IdentityRole> roleManager;


		public ViewAllFoodModel(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, FoodService foodService, RoleManager<IdentityRole> roleManager)
		{
			this.userManager = userManager;
			this.signInManager = signInManager;
			_foodService = foodService;
			this.roleManager = roleManager;
		}
		private readonly FoodService _foodService;

		public List<FoodItem> FoodItemList { get; set; } = new();
		public FoodItem FoodItems { get; set; } = new();

		public void OnGet()
		{
			FoodItemList = _foodService.GetAll();
		}
	}
}
