using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using SusFoodBank.Models;
using SusFoodBank.Services;
using System.ComponentModel.DataAnnotations;

namespace SusFoodBank.Pages.FAQs
{
	public class FoodDetailsModel : PageModel
	{
		private readonly FoodService _foodService;
		private readonly MyDbContext _context;
		public FoodDetailsModel(FoodService foodService, MyDbContext context)
		{
			_foodService = foodService;
			_context = context;
		}

		[BindProperty]
		public FoodItem FoodItems { get; set; } = new();

		public static List<FoodItem> FoodItemList { get; set; } = new();


		public IActionResult OnGet(int id)
		{
			FoodItemList = _foodService.GetAll();

			FoodItem? fooditem = _foodService.GetFoodItemById(id);
			if (fooditem != null)
			{
				FoodItems = fooditem;
				return Page();
			}
			else
			{
				TempData["FlashMessage.Type"] = "danger";
				TempData["FlashMessage.Text"] = string.Format("Food Item ID {0} not found", id);
				return Redirect("/FAQs/ViewAllFood");
			}
		}


		public IActionResult OnPost()
		{
			if (ModelState.IsValid)
			{
				_context.FoodItems.Update(FoodItems);
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

		public IActionResult OnPostDelete()
		{
			_foodService.DeleteFoodItem(FoodItems);
			TempData["FlashMessage.Type"] = "success";
			TempData["FlashMessage.Text"] = string.Format("FoodItem {0} has been deleted", FoodItems.Name);
			return Redirect("/FAQs/ViewAllFood");
		}
	}
}
