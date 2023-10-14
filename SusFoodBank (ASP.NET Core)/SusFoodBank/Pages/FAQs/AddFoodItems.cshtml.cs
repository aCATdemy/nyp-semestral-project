using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using SusFoodBank.Models;
using SusFoodBank.Services;
using System.ComponentModel.DataAnnotations;

namespace SusFoodBank.Pages.FAQs
{
	public class AddFoodItemsModel : PageModel
	{
		private readonly FoodService _foodService;
		private readonly MyDbContext _context;
		public AddFoodItemsModel(FoodService foodService, MyDbContext context)
		{
			_foodService = foodService;
			_context = context;
		}
		[BindProperty]
		public FoodItem FoodItems { get; set; } = new();
		public void OnGet()
		{
		}
		public IActionResult OnPost()
		{
			if (ModelState.IsValid)
			{
				_context.FoodItems.Add(FoodItems);
				try
				{
					_context.SaveChanges();
				}
				catch (DbUpdateException ex)
				{
					if (ex.InnerException is SqlException sqlException &&
						(sqlException.Number == 2601 || sqlException.Number == 2627))
					{
						List<ValidationResult> validationResult = new List<ValidationResult>();
						ValidationResult errorMessage = new ValidationResult("Food item name already exists.", new[] { "FoodItems.Name" });
						validationResult.Add(errorMessage);
                        TempData["FlashMessage.Type"] = "FoodItem Name already exists";
                        TempData["FlashMessage.Text"] = string.Format(" {0} already exists", FoodItems.Name);
                        return Page();
                        
                    }
					else
					{
						return Page();
					}
				}
				TempData["FlashMessage.Type"] = "success";
				TempData["FlashMessage.Text"] = string.Format(" {0} is added", FoodItems.Name);
				return Redirect("/FAQs/ViewAllFood");

			}
			return Page();
		}
	}
}
