using System.ComponentModel.DataAnnotations;

namespace SusFoodBank.Models
{
	public class Question
	{
		public int Id { get; set; }

		[Required, MaxLength(100)]
		public string Title { get; set; } = string.Empty;


		[Required, MaxLength(150)]
		public string Description { get; set; } = string.Empty;

	}
}
