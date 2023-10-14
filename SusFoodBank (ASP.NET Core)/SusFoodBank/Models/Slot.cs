namespace SusFoodBank.Models
{
    public class Slot
    {
        public int SlotId { get; set; }
        public DateTime SlotDate { get; set; }

        public int SlotSessionId { get; set; }
        public SlotSession? SlotSession { get; set; }
        
        public bool SlotAvailability { get; set; }

        public Booking? Booking { get; set; }
    }
}
