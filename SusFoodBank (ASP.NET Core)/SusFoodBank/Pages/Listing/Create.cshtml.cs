using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SusFoodBank.Services;
using SusFoodBank.Models;
using Microsoft.AspNetCore.Authorization;
using System.Data;

namespace SusFoodBank.Pages.Listing
{
    [Authorize]
    [Authorize(Roles = "User")]
    public class CreateModel : PageModel
    {
        private readonly ItemService itemService;
        private readonly IWebHostEnvironment environment;

        [BindProperty]
        public Item Item { get; set; } = new();

        [BindProperty]
        public IFormFile? Upload { get; set; }
        public CreateModel(ItemService itemService, IWebHostEnvironment environment)
        {
            this.itemService = itemService;
            this.environment = environment;

        }
        public void OnGet()
        {
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (ModelState.IsValid)
            {
 
                if (Upload != null)
                {
                    if (Upload.Length > 2 * 1024 * 1024)
                    {
                        ModelState.AddModelError("Upload", "File size cannot exceed 2MB.");
                        return Page();
                    }
                    var uploadsFolder = "uploads";
                    var imageFile = Guid.NewGuid() + Path.GetExtension(Upload.FileName);
                    var imagePath = Path.Combine(environment.ContentRootPath, "wwwroot", uploadsFolder, imageFile);
                    using var fileStream = new FileStream(imagePath, FileMode.Create);
                    await Upload.CopyToAsync(fileStream);
                    Item.ImageFile = string.Format("/{0}/{1}", uploadsFolder, imageFile);
                }

                itemService.AddItem(Item);
                TempData["FlashMessage.Type"] = "success";
                TempData["FlashMessage.Text"] = string.Format("Listing is added");
                return Redirect("/listing/index");
            }
            return Page();
        }
    }
}
