using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SusFoodBank.Models;
using SusFoodBank.Services;
using System.Data;

namespace SusFoodBank.Pages.Appointment.Staff
{
    [Authorize(Roles = "Admin")]
    public class BookingListModel : PageModel
    {
        private UserManager<ApplicationUser> userManager { get; }
        private readonly BookingService _bookingService;
        private readonly SlotService _slotService;
        private readonly SlotSessionService _slotSessionService;

        public BookingListModel(UserManager<ApplicationUser> userManager, BookingService bookingService, SlotService slotService, SlotSessionService slotSessionService)
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
            BookingList = _bookingService.GetAll();
            SlotList = _slotService.GetAll();
            SlotSessionList = _slotSessionService.GetAll();
        }
    }
}
