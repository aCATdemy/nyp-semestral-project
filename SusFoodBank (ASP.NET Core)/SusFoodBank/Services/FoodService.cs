using SusFoodBank.Models;

namespace SusFoodBank.Services
{
	public class FoodService
	{
		private readonly MyDbContext _context;

		public FoodService(MyDbContext context)
		{
			_context = context;
		}

		public List<FoodItem> GetAll()
		{
			return _context.FoodItems.OrderBy(m => m.Id).ToList();
		}

		public FoodItem? GetFoodItemById(int id)
		{
			FoodItem? fooditem = _context.FoodItems.FirstOrDefault(x => x.Id.Equals(id));
			return fooditem;
		}

		public void AddFoodItem(FoodItem fooditem)
		{
			_context.FoodItems.Add(fooditem);
			_context.SaveChanges();
		}

		public void UpdateFoodItem(FoodItem fooditem)
		{
			_context.FoodItems.Update(fooditem);
			_context.SaveChanges();
		}
		public void DeleteFoodItem(FoodItem fooditem)
		{
			_context.FoodItems.Remove(fooditem);
			_context.SaveChanges();
		}
	}
}


