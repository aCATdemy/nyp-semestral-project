using Microsoft.AspNetCore.Identity;

namespace SusFoodBank.Models
{
	public class ApplicationUser : IdentityUser
	{
		public string FullName { get; set; }
		public string Gender { get; set; }
		public string? ImageURL { get; set; }
		public bool Suspended { get; set; }

		public bool Deleted { get; set; }
	}
}
