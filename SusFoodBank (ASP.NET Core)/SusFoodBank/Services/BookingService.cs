using SusFoodBank.Models;

namespace SusFoodBank.Services
{
    public class BookingService
    {
        private readonly MyDbContext _context;

        public BookingService(MyDbContext context)
        {
            _context = context;
        }

        public List<Booking> GetAll()
        {
            return _context.Bookings.OrderByDescending(x => x.BookingId).ToList();
        }

        public Booking? GetBookingById(int id)
        {
            Booking? booking = _context.Bookings.FirstOrDefault(x => x.BookingId.Equals(id));
            return booking;
        }

        public void AddBooking(Booking booking)
        {
            _context.Bookings.Add(booking);
            _context.SaveChanges();
        }

        public void UpdateBooking(Booking booking)
        {
            _context.Bookings.Update(booking);
            _context.SaveChanges();
        }

        public void RemoveBooking(int id)
        {
            Booking? booking = _context.Bookings.FirstOrDefault(x => x.BookingId.Equals(id));
            _context.Bookings.Remove(booking);
            _context.SaveChanges();
        }
    }
}
