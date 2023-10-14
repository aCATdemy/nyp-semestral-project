using Microsoft.AspNetCore.Mvc.RazorPages;
using SusFoodBank.Models;
using SusFoodBank.Services;


namespace SusFoodBank.Pages.FAQs
{
	public class ViewAllQuestionsModel : PageModel
	{
		private readonly QuestionService _questionService;

		public Question Questions { get; set; } = new();

		public List<Question> QuestionList { get; set; } = new();

		public ViewAllQuestionsModel(QuestionService questionService)
		{
			_questionService = questionService;
		}

		public void OnGet()
		{
			QuestionList = _questionService.GetAll();
		}
	}
}