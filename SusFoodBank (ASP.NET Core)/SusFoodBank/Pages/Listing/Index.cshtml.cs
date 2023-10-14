using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SusFoodBank.Models;
using SusFoodBank.Services;

namespace SusFoodBank.Pages.Listing
{
    public class IndexModel : PageModel
    {
        public ItemService itemService;
        public List<Item> Items;
        private IWebHostEnvironment environment;
        public string DisplayValue { get; set; }




        public IndexModel(ItemService itemService, IWebHostEnvironment environment)
        {

            this.itemService = itemService;
            this.environment = environment;
        }

        [BindProperty]
        public Item item { get; set; } = new();

        public IActionResult OnGet()
        {
            Items = itemService.GetAll();

            foreach (var item in Items)
            {
                bool Halal = Convert.ToBoolean(item.Halal);
                if (Halal)
                {
                    DisplayValue = "Yes";
                }
                else
                {
                    DisplayValue = "No";
                }
            }

            return Page();
        }
    }
}
