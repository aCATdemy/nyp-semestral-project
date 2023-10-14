using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SusFoodBank.Models;
using SusFoodBank.Services;
using System.Data;

namespace SusFoodBank.Pages.Appointment.Staff
{
    [Authorize(Roles = "Admin")]
    public class ConsoleModel : PageModel
    {
        private readonly SlotService _slotService;
        private readonly SlotSessionService _slotSessionService;
        private IWebHostEnvironment _environment;

        public ConsoleModel(SlotService slotService, SlotSessionService slotSessionService, IWebHostEnvironment environment)
        {
            _slotService = slotService;
            _slotSessionService = slotSessionService;
            _environment = environment;
        }

        public List<Slot> SlotList { get; set; } = new();
        public static List<SlotSession> SlotSessionList { get; set; } = new();

        public DateTime? DateSelected { get; set; }

        public void OnGet()
        {
        }

        public async Task<IActionResult> OnGetDateSelector(DateTime date)
        {
            SlotList.Clear();
            SlotSessionList.Clear();

            SlotSessionList = _slotSessionService.GetAll();

            DateSelected = date;

            List<Slot> dbSlots = _slotService.GetAll();

            if (dbSlots.Count > 0)
            {
                foreach (var slot in dbSlots)
                {
                    if (slot.SlotDate.Date == date.Date)
                    {
                        SlotList.Add(slot);
                    }
                }
            }
            return Page();
        }
    }
}
