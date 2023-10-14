using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SusFoodBank.Models;
using SusFoodBank.Services;

namespace SusFoodBank.Pages.Listing
{
    public class ListingModel : PageModel
    {
        private readonly ItemService itemService;
        public List<Item> Items;

        public ListingModel(ItemService itemService)
        {
            this.itemService = itemService;
        }
        public IActionResult OnGet()
        {
            this.Items = this.itemService.GetAll();
            return Page();
        }

        public IActionResult OnPost()
        {
            if(ModelState.IsValid)
            {
                TempData["FlashMessage.Type"] = "Successfully listed";
                TempData["FlashMessage.Text"] = string.Format("Item is successfully listed");
                return Redirect("/");
                    }
            return Page();
        }


    }
}
