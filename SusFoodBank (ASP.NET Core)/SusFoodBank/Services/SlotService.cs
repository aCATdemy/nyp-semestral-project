using SusFoodBank.Models;

namespace SusFoodBank.Services
{
	public class SlotService
	{
		private readonly MyDbContext _context;

		public SlotService(MyDbContext context)
		{
			_context = context;
		}

		public List<Slot> GetAll()
		{
			return _context.Slots.ToList();
		}

        public Slot? GetSlotById(int id)
        {
            Slot? slot = _context.Slots.FirstOrDefault(x => x.SlotId.Equals(id));
            return slot;
        }

        public Slot? GetSlotByDate(DateTime date)
        {
            Slot? slotDate = _context.Slots.FirstOrDefault(d => d.SlotDate.Equals(date));
            return slotDate;
        }

        public Slot? GetSlotByTime(DateTime time)
        {
            Slot? slotTime = _context.Slots.FirstOrDefault(d => d.SlotSession.Equals(time));
            return slotTime;
        }

        public void AddSlot(Slot slot)
        {
            _context.Slots.Add(slot);
            _context.SaveChanges();
        }

		public void UpdateSlot(Slot slot)
		{
			_context.Slots.Update(slot);
			_context.SaveChanges();
		}

		public void RemoveSlot(Slot slot)
		{
			_context.Slots.Remove(slot);
			_context.SaveChanges();
		}
	}
}
