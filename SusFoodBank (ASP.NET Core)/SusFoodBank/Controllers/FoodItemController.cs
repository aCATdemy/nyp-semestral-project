using Microsoft.AspNetCore.Mvc;
using SusFoodBank.Models;

namespace SusFoodBank.Controllers
{
    public class FoodItemController : Controller
    {
        private readonly MyDbContext _context;

        public FoodItemController(MyDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }
        public async Task<IActionResult> Delete(FoodItem fooditem)
        {
            var food = await _context.FoodItems.FindAsync(fooditem.Id);
            if (food != null)
            {
                _context.FoodItems.Remove(food);
                await _context.SaveChangesAsync();

                return RedirectToAction("ViewAllFood");
            }
            return RedirectToAction("ViewAllFood");
        }
    }
}
