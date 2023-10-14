namespace SusFoodBank.Models
{
    public class Booking
    {
        public int BookingId { get; set; }
        public string BookingStatus { get; set; }

        public int SlotId { get; set; }
        public Slot? Slot { get; set; }

        // ApplicationUser:
        public string ApplicationUserId { get; set; }
        public ApplicationUser? ApplicationUser { get; set; }
    }
}
