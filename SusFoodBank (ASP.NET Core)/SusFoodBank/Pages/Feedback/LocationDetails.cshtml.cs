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
    public class LocationDetailsModel : PageModel
	{

		private readonly LocationService _locationService;
		private readonly MyDbContext _DbContext;
		public LocationDetailsModel(LocationService locationService, MyDbContext context)
		{
			_locationService = locationService;
			_DbContext = context;
		}

		[BindProperty]
		public Locations locations { get; set; } = new();

		public List<Locations> LocationsList { get; set; } = new();

		public IActionResult OnGet(int id)
		{
			LocationsList = _locationService.GetAll();

			Locations? location = _locationService.GetLocationById(id);
			if (location != null)
			{
				locations = location;
				return Page();
			}
			else
			{
				TempData["FlashMessage.Type"] = "danger";
				TempData["FlashMessage.Text"] = string.Format("Location ID {0} not found", id);
				return Redirect("/Feedback/ViewLocations");
			}
		}

		public IActionResult OnPost()
		{
			if (ModelState.IsValid)
			{
				_locationService.UpdateLocation(locations);
				return Redirect("/Feedback/ViewLocations");
			}
			return Page();
		}

        public IActionResult OnPostDelete()
        {
            _locationService.RemoveLocation(locations);
            return Redirect("/Feedback/LocationDetails");
        }
    }
}
