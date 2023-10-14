using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SusFoodBank.Models;

namespace SusFoodBank
{
	public class MyDbContext : IdentityDbContext<ApplicationUser>
	{
		private readonly IConfiguration _configuration;

		public MyDbContext(IConfiguration configuration)
		{
			_configuration = configuration;
		}
		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
		{
			string connectionString = _configuration.GetConnectionString("MyConnection");
			optionsBuilder.UseSqlServer(connectionString);
		}
		internal Item? FirstOrDefault(Func<object, bool> value)
		{
			throw new NotImplementedException();
		}
		public DbSet<Question> Questions { get; set; }
		public DbSet<FoodItem> FoodItems { get; set; }
		public DbSet<Item> Items { get; set; }
		public DbSet<Locations> Locations { get; set; }

		// Appointment:
		public DbSet<Booking> Bookings { get; set; }
		public DbSet<Slot> Slots { get; set; }
		public DbSet<SlotSession> SlotSessions { get; set; }

		// tracking

		public DbSet<Analytics> Analytics { get; set; }
		public DbSet<loginlist> loginlist { get; set; }
	}
}