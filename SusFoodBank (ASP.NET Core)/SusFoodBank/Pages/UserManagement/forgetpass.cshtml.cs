using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SendGrid.Helpers.Mail;
using SendGrid;
using Microsoft.AspNetCore.Identity.UI.Services;
using MailKit.Security;
using MimeKit.Text;
using MimeKit;
using MailKit.Net.Smtp;
using SusFoodBank.Models;
using System.ComponentModel.DataAnnotations;
using Microsoft.IdentityModel.Tokens;

namespace SusFoodBank.Pages.UserManagement


{


	public class forgetpassModel : PageModel
	{
		private UserManager<ApplicationUser> userManager { get; }

		public forgetpassModel(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
		{
			this.userManager = userManager;

		} 
		[BindProperty]
		[EmailAddress]
		public string? Email { get; set; }


		public void OnGet()
		{
		}
		public IActionResult OnPost()
		{
			if (Email.IsNullOrEmpty())
			{
                ModelState.AddModelError("", "Error!");
                //might not work!!
                return Redirect("/UserManagement/Login");
            }
			try
			{
				var user = userManager.FindByEmailAsync(Email).Result;
				var id = user.Id;
				var body = $"https://localhost:7112/UserManagement/Changepassword?ID={id}";


			// create email message
			var email = new MimeMessage();
			email.From.Add(MailboxAddress.Parse("susfoodbank123@gmail.com"));
			email.To.Add(MailboxAddress.Parse(Email));
			email.Subject = "Password Reset Link";
			email.Body = new TextPart(TextFormat.Html) { Text = $"<h1>Password Reset Link </h1> <br> {body} " };

			// send email
			using var smtp = new SmtpClient();
			smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
			smtp.Authenticate("susfoodbank123@gmail.com", "wqcobmjzaapsssmm");
			smtp.Send(email);
			smtp.Disconnect(true);
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", ex.ToString());
                //might not work!!
                return Redirect("/UserManagement/Login");
            }

            return Page();
		}

	}
}
