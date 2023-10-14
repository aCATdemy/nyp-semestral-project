using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Hosting;
using SusFoodBank.Models;
using SusFoodBank.Services;
using System;
using System.Data;

namespace SusFoodBank.Pages.Listing
{
    [Authorize]
    [Authorize(Roles = "User")]
    public class DetailsModel : PageModel
    {
        private readonly ItemService itemService;
        private IWebHostEnvironment environment;
        private readonly MyDbContext _context;
        public DetailsModel(ItemService itemService, IWebHostEnvironment environment, MyDbContext context)
        {

            this.itemService = itemService;
            this.environment = environment;
            _context = context;
        }
        [BindProperty]
        public Item items { get; set; } = new();

        [BindProperty]
        public IFormFile? Upload { get; set; }

        public IActionResult OnGet(int Id)
        {
            Item? item = itemService.GetItemById(Id);
            if (item != null)
            {
                items = item;
                return Page();
            }
            else
            {
                TempData["FlashMessage.Type"] = "danger";
                TempData["FlashMessage.Text"] = string.Format("Item not found");
                return Redirect("/Listing");
            }

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
                    if (items.ImageFile != null)
                    {
                        var oldImageFile = Path.GetFileName(items.ImageFile);
                        var oldImagePath = Path.Combine(environment.ContentRootPath, "wwwroot", uploadsFolder, oldImageFile);
                        if (System.IO.File.Exists(oldImagePath))
                        {
                            System.IO.File.Delete(oldImagePath);
                        }
                    }

                    var imageFile = Guid.NewGuid() + Path.GetExtension(Upload.FileName);
                    var imagePath = Path.Combine(environment.ContentRootPath, "wwwroot", uploadsFolder, imageFile);
                    using var fileStream = new FileStream(imagePath, FileMode.Create);
                    await Upload.CopyToAsync(fileStream);
                    items.ImageFile = string.Format("/{0}/{1}", uploadsFolder, imageFile);
                }
                itemService.UpdateItem(items);
                TempData["FlashMessage.Type"] = "success";
                TempData["FlashMessage.Text"] = string.Format("Listing is updated");
                return Redirect("/Listing/index");
            }
            return Page();
        }
        public IActionResult OnPostDelete()
        {
            itemService.DeleteItem(items);
            return Redirect("/Listing/index");
        }
    }
}
