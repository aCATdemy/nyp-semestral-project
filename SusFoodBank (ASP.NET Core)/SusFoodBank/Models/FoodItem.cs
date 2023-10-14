using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;


namespace SusFoodBank.Models
{
	[Index(nameof(Name), IsUnique = true, Name = "Unique_Name")]
	public class FoodItem
	{
		public int Id { get; set; }

		[Required, MaxLength(20)]
		public string Name { get; set; } = string.Empty;

		[Required, MaxLength(150)]
		public string Description { get; set; } = string.Empty;

		[Required, MaxLength(50)]
		public string ExpiryDate { get; set; } = string.Empty;
	}
}
