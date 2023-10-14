using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SusFoodBank.Models;
using SusFoodBank.Services;
using System.Data;

namespace SusFoodBank.Pages.Appointment
{
    [Authorize(Roles = "User")]
    public class BookModel : PageModel
    {
        private UserManager<ApplicationUser> userManager { get; }
        private readonly BookingService _bookingService;
        private readonly SlotService _slotService;
        private readonly SlotSessionService _slotSessionService;
        private IWebHostEnvironment _environment;

        public BookModel(UserManager<ApplicationUser> userManager, BookingService bookingService, SlotService slotService, SlotSessionService slotSessionService, IWebHostEnvironment environment)
        {
            this.userManager = userManager;
            _bookingService = bookingService;
            _slotService = slotService;
            _slotSessionService = slotSessionService;
            _environment = environment;
        }

        [BindProperty]
        public Booking MyBooking { get; set; } = new();

        [BindProperty]
        public Slot MySlot { get; set; } = new();

        public List<Slot> SlotList { get; set; } = new();
        public static List<SlotSession> SlotSessionList { get; set; } = new();
        public DateTime? DateSelected { get; set; }

        public void OnGet()
        {
        }

        public async Task<IActionResult> OnGetDateSelector(DateTime selectedDate)
        {
            SlotList.Clear();
            SlotSessionList.Clear();

            DateSelected = selectedDate;
            if (selectedDate < DateTime.Now.Date)
            {
                TempData["FlashMessage.Type"] = "warning";
                TempData["FlashMessage.Text"] = string.Format("Please select a valid date.");
                return Page();
            }
            List<Slot> rawSlot = _slotService.GetAll();
            SlotSessionList = _slotSessionService.GetAll();

            foreach (var slot in rawSlot)
            {
                if (slot.SlotDate == selectedDate)
                {
                    if (slot.SlotAvailability)
                    {
                        if (selectedDate.ToShortDateString() == DateTime.Now.ToShortDateString())
                        {
                            if (slot.SlotSession.SlotTime.TimeOfDay > DateTime.Now.TimeOfDay)
                            {
                                SlotList.Add(slot);
                            }
                        }
                        else
                        {
                            SlotList.Add(slot);
                        }
                    }
                }
            }
            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            var userId = userManager.GetUserId(HttpContext.User);
            if (userId != null)
            {
                ApplicationUser user = userManager.FindByIdAsync(userId).Result;
                MyBooking.ApplicationUserId = user.Id;

                Slot? slot = _slotService.GetSlotById(MySlot.SlotId);
                if (slot == null)
                {
                    TempData["FlashMessage.Type"] = "danger";
                    TempData["FlashMessage.Text"] = string.Format("An error occurred while processing your booking. Please try again.");
                    return Page();
                }

                if (!slot.SlotAvailability)
                {
                    TempData["FlashMessage.Type"] = "danger";
                    TempData["FlashMessage.Text"] = string.Format("Our apologies, but the appointment slot you selected is no longer available as another user has booked it. Please click 'Refresh Slots Availability' to get the latest available slots.");
                    return Page();
                }

                slot.SlotAvailability = false;
                _slotService.UpdateSlot(slot);

                MyBooking.BookingStatus = "Confirmed";
                MyBooking.SlotId = MySlot.SlotId;
                _bookingService.AddBooking(MyBooking);

                TempData["FlashMessage.Type"] = "success";
                TempData["FlashMessage.Text"] = string.Format("You've successfully booked an appointment (ID: {0}). Please arrive at least five minutes before your time slot.", MyBooking.BookingId);

            }
            return RedirectToPage("/Appointment/Index");
        }
    }
}
