namespace SusFoodBank.Models
{
    public class SlotSession
    {
        public int SlotSessionId { get; set; }
        public DateTime SlotTime { get; set; }

        public ICollection<Slot>? Slots { get; set; }
    }
}
