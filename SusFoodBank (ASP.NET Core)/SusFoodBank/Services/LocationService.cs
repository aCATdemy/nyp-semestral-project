using SusFoodBank.Models;

namespace SusFoodBank.Services
{
	public class LocationService
	{

		private readonly MyDbContext _context;

		public LocationService(MyDbContext context)
		{
			_context = context;
		}

		//R
		public List<Locations> GetAll()
		{
			return _context.Locations.ToList();
		}

		public Locations? GetLocationById(int id)
		{
			Locations? location = _context.Locations.FirstOrDefault(x => x.Id.Equals(id));
			return location;
		}

		//C
		public void AddLocation(Locations location)
		{
			_context.Locations.Add(location);
			_context.SaveChanges();
		}

		//U
		public void UpdateLocation(Locations location)
		{
			_context.Locations.Update(location);
			_context.SaveChanges();
		}


		//D
		public void RemoveLocation(Locations location)
		{
			_context.Locations.Remove(location);
			_context.SaveChanges();
		}
	}
}
