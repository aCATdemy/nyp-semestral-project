using System.ComponentModel.DataAnnotations;

namespace SusFoodBank.Models
{
	public class Locations
	{

		public int Id { get; set; }

		[Required]
		public string Location { get; set; } = string.Empty;

		[Required]
		public string Reason { get; set; } = string.Empty;

	}
}
