using System.ComponentModel.DataAnnotations;

namespace SusFoodBank.Models
{
	public class Update
	{
		[Required]
		[DataType(DataType.EmailAddress)]
		public string Email { get; set; }
		[Required]
		[DataType(DataType.Text)]
		public string UserName { get; set; }
		//[Required]
		//      [DataType(DataType.Password)]
		//      public string OldPassword { get; set; } 
		//[Required]
		//[DataType(DataType.Password)]
		//public string Password { get; set; } 

		//[Required]
		//[DataType(DataType.Password)]
		//[Compare(nameof(Password), ErrorMessage = "Password and confirmation password does not match")]
		//public string ConfirmPassword { get; set; }
	}
}
