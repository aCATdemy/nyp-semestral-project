using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SusFoodBank.Models;
using SusFoodBank.Services;
using System.Data;

namespace SusFoodBank.Pages.Feedback
{
    [Authorize]
    [Authorize(Roles = "User")]
    public class AddLocationModel : PageModel
	{
		private readonly LocationService _locationService;

		public AddLocationModel(LocationService locationService)
		{
			_locationService = locationService;
		}

		[BindProperty]
		public Locations locations { get; set; } = new();


		public void OnGet()
		{
		}

		public IActionResult OnPost()
		{
			if (ModelState.IsValid)
			{
				_locationService.AddLocation(locations);
				TempData["FlashMessage.Type"] = "success";
				TempData["FlashMessage.Text"] = string.Format(" {0} is added", locations.Location);
				return Redirect("/Feedback/ViewLocations");
			}
			return Page();
		}
	}
}
