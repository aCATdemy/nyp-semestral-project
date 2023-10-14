using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace SusFoodBank.Models
{
	public class Register
	{
		[Required]
		[DataType(DataType.EmailAddress)]
		[EmailAddress]
		public string Email { get; set; } = string.Empty;
		[Required]
		[DataType(DataType.Text)]
		public string FullName { get; set; } = string.Empty;
		[Required]
		[DataType(DataType.Password)]
		[PasswordPropertyText]
		//[MinLength(12, ErrorMessage = "Enter at least a 12 characters password")]
		//[RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{12,}$", ErrorMessage = "Passwords must be at least 12 characters long and contain at least an upper case letter, lower case letter, digit and a symbol")]
		public string Password { get; set; } = string.Empty;
		[Required]
		[DataType(DataType.Password)]
		[PasswordPropertyText]
		[Compare(nameof(Password), ErrorMessage = "Password and confirmation password does not match")]
		public string ConfirmPassword { get; set; } = string.Empty;

		[Required]
		public string Gender { get; set; }

		public string imageURL { get; set; } = string.Empty;


	}
}
