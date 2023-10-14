using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SusFoodBank.Models;
using SusFoodBank.Services;
using System.Data;

namespace SusFoodBank.Pages.Appointment
{
    [Authorize(Roles = "User")]
    public class DetailsModel : PageModel
    {
        private readonly BookingService _bookingService;
        private readonly SlotService _slotService;
        private readonly SlotSessionService _slotSessionService;

        public DetailsModel(BookingService bookingService, SlotService slotService, SlotSessionService slotSessionService)
        {
            _bookingService = bookingService;
            _slotService = slotService;
            _slotSessionService = slotSessionService;
        }

        [BindProperty]
        public Booking MyBooking { get; set; } = new();

        public Slot Slot { get; set; } = new();

        public static List<Slot> SlotList { get; set; } = new();
        public static List<SlotSession> SlotSessionList { get; set; } = new();

        public IActionResult OnGet(int id)
        {
            SlotList = _slotService.GetAll();
            SlotSessionList = _slotSessionService.GetAll();

            Booking? booking = _bookingService.GetBookingById(id);
            if (booking != null)
            {
                MyBooking = booking;
                return Page();
            }
            else
            {
                TempData["FlashMessage.Type"] = "danger";
                TempData["FlashMessage.Text"] = string.Format("Booking ID {0} is not found.", id);
                return RedirectToPage("/Appointment/Index");
            }
        }
        
        public async Task<IActionResult> OnPostAsync(int id)
        {
            _bookingService.RemoveBooking(id);

            TempData["FlashMessage.Type"] = "success";
            TempData["FlashMessage.Text"] = string.Format("You have successfully cancelled your appointment.");
            return RedirectToPage("/Appointment/Index");
        }
    }
}
