using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SusFoodBank.Models;
using SusFoodBank.Services;

namespace SusFoodBank.Pages.FAQs
{
	[Authorize]
	[Authorize(Roles = "User")]
	public class AddQuestionsModel : PageModel
	{

		private readonly QuestionService _questionService;

		public AddQuestionsModel(QuestionService questionService)
		{
			_questionService = questionService;
		}
		[BindProperty]
		public Question Questions { get; set; } = new();
		public void OnGet()
		{
		}
		public IActionResult OnPost()
		{
			if (ModelState.IsValid)
			{
				_questionService.AddQuestion(Questions);
				TempData["FlashMessage.Type"] = "success";
				TempData["FlashMessage.Text"] = string.Format(" {0} is added", Questions.Title);
				return Redirect("/FAQs/ViewAllQuestions");
			}
			return Page();
		}
	}
}
