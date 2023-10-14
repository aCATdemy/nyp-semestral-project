using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SusFoodBank.Models;
using SusFoodBank.Services;
using System.Data;

namespace SusFoodBank.Pages.Appointment.Staff
{
    [Authorize(Roles = "Admin")]
    public class AddModel : PageModel
    {
        private readonly SlotService _slotService;
        private readonly SlotSessionService _slotSessionService;
        private IWebHostEnvironment _environment;

        public AddModel(SlotService slotService, SlotSessionService slotSessionService, IWebHostEnvironment environment)
        {
            _slotService = slotService;
            _slotSessionService = slotSessionService;
            _environment = environment;
        }

        [BindProperty]
        public Slot MySlot { get; set; } = new();
        public List<SlotSession> SlotSessionList { get; set; } = new();

        public DateTime? DateSelected { get; set; }

        public void OnGet()
        {
        }

        public async Task<IActionResult> OnGetDateSelector(DateTime date)
        {
            SlotSessionList.Clear();

            DateSelected = date;
            if (date < DateTime.Now.Date)
            {
                TempData["FlashMessage.Type"] = "warning";
                TempData["FlashMessage.Text"] = string.Format("Please select a valid date.");
                return Page();
            }

            List<Slot> dbSlots = _slotService.GetAll();
            List<SlotSession> dbSlotSessions = _slotSessionService.GetAll();

            if (dbSlots.Count != 0)
            {
                foreach (var slot in dbSlots)
                {
                    foreach (var session in dbSlotSessions)
                    {
                        if (slot.SlotDate.Date != date.Date)
                        {
                            SlotSessionList.Add(session);
                        }
                        else
                        {
                            if (slot.SlotSession.SlotTime.TimeOfDay > DateTime.Now.TimeOfDay)
                            {
                                SlotSessionList.Add(session);
                            }
                        }
                    }
                }
            }
            else
            {
                if (date.Date == DateTime.Now.Date)
                {
                    foreach (var session in dbSlotSessions)
                    {
                        if (session.SlotTime.TimeOfDay > DateTime.Now.TimeOfDay)
                        {
                            SlotSessionList.Add(session);
                        }
                    }
                }
                else
                {
                    foreach (var session in dbSlotSessions)
                    {
                        SlotSessionList.Add(session);
                    }
                }
            }

            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (ModelState.IsValid)
            {
                MySlot.SlotAvailability = true;
                _slotService.AddSlot(MySlot);
                TempData["FlashMessage.Type"] = "success";
                TempData["FlashMessage.Text"] = string.Format("You've successfully added an appointment slot for {0}.", MySlot.SlotDate.ToShortDateString());
            }
            else
            {
                TempData["FlashMessage.Type"] = "danger";
                TempData["FlashMessage.Text"] = string.Format("Error encountered while adding slot. Please try again!");
            }
            return Page();
        }
    }
}
