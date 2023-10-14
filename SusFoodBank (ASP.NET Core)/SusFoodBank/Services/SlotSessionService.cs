using SusFoodBank.Models;

namespace SusFoodBank.Services
{
    public class SlotSessionService
    {
        private readonly MyDbContext _context;

        public SlotSessionService(MyDbContext context)
        {
            _context = context;
        }

        public List<SlotSession> GetAll()
        {
            return _context.SlotSessions.ToList();
        }

        public SlotSession? GetSlotSessionById(int id)
        {
            SlotSession? slotSession = _context.SlotSessions.FirstOrDefault(x => x.SlotSessionId.Equals(id));
            return slotSession;
        }
    }
}
