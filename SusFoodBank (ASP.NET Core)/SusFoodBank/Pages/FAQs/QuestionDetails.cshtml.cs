using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SusFoodBank.Models;
using SusFoodBank.Services;

namespace SusFoodBank.Pages.FAQs
{
	public class QuestionDetailsModel : PageModel
	{
		private readonly QuestionService _questionService;
		private readonly MyDbContext _context;
		public QuestionDetailsModel(QuestionService questionService, MyDbContext context)
		{
			_questionService = questionService;
			_context = context;
		}

		[BindProperty]
		public Question Questions { get; set; } = new();

		public List<Question> QuestionList { get; set; } = new();

		public IActionResult OnGet(int id)
		{
			QuestionList = _questionService.GetAll();

			Question? question = _questionService.GetQuestionById(id);
			if (question != null)
			{
				Questions = question;
				return Page();
			}
			else
			{
				TempData["FlashMessage.Type"] = "danger";
				TempData["FlashMessage.Text"] = string.Format("Question ID {0} not found", id);
				return Redirect("/FAQs/ViewAllQuestions");
			}
		}
		public IActionResult OnPost()
		{
			if (ModelState.IsValid)
			{
				_questionService.UpdateQuestion(Questions);
				TempData["FlashMessage.Type"] = "success";
				TempData["FlashMessage.Text"] = string.Format("Question {0} is updated", Questions.Id);
				return Redirect("/FAQs/ViewAllQuestions");
			}
			return Page();
		}
		public IActionResult OnPostDelete()
		{
			_questionService.DeleteQuestion(Questions);
			TempData["FlashMessage.Type"] = "success";
			TempData["FlashMessage.Text"] = string.Format("Question {0} has been deleted", Questions.Id);
			return Redirect("/FAQS/ViewAllQuestions");
		}
	}
}
