using SusFoodBank.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace SusFoodBank.Services
{
    public class ItemService
    {
        private readonly MyDbContext _context;

        public ItemService(MyDbContext context)
        {
            _context = context;
        }

        public List<Item> GetAll()
        {
            return _context.Items.OrderBy(m => m.Name).ToList();
        }

        public Item? GetItemById(int id)
        {
            Item? item = _context.Items.FirstOrDefault(x => x.Id.Equals(id));
            return item;
        }

        public void AddItem(Item item)
        {
            _context.Items.Add(item);
            _context.SaveChanges();
        }


        public void UpdateItem(Item item)
        {
            _context.Items.Update(item);
            _context.SaveChanges();
        }

        public void DeleteItem(Item item)
        {
            _context.Items.Remove(item);
            _context.SaveChanges();

        }
    }
}
