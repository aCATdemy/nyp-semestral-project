using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SusFoodBank.Models;
using SusFoodBank.Services;
using System.Data;

namespace SusFoodBank.Pages.Appointment
{
    [Authorize(Roles = "User")]
    public class IndexModel : PageModel
    {
        private UserManager<ApplicationUser> userManager { get; }
        private readonly BookingService _bookingService;
        private readonly SlotService _slotService;
        private readonly SlotSessionService _slotSessionService;

        public IndexModel(UserManager<ApplicationUser> userManager, BookingService bookingService, SlotService slotService, SlotSessionService slotSessionService)
        {
            this.userManager = userManager;
            _bookingService = bookingService;
            _slotService = slotService;
            _slotSessionService = slotSessionService;
        }

        public List<Booking> BookingList { get; set; } = new();

        public static List<Slot> SlotList { get; set; } = new();
        public static List<SlotSession> SlotSessionList { get; set; } = new();

        public void OnGet()
        {
            List<Booking> AllBookingList = _bookingService.GetAll();
            SlotList = _slotService.GetAll();
            SlotSessionList = _slotSessionService.GetAll();

            var userId = userManager.GetUserId(HttpContext.User);
            if (userId != null)
            {
                foreach (var booking in AllBookingList)
                {
                    if (booking.ApplicationUserId == userId)
                    {
                        BookingList.Add(booking);
                    }
                }
            }
        }
    }
}
