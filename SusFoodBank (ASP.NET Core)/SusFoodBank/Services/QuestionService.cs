using SusFoodBank.Models;

namespace SusFoodBank.Services
{
	public class QuestionService
	{
		private readonly MyDbContext _context;

		public QuestionService(MyDbContext context)
		{
			_context = context;
		}

		public List<Question> GetAll()
		{
			return _context.Questions.OrderBy(m => m.Id).ToList();
		}

		public Question? GetQuestionById(int id)
		{
			Question? question = _context.Questions.FirstOrDefault(x => x.Id.Equals(id));
			return question;
		}

		public void AddQuestion(Question question)
		{
			_context.Questions.Add(question);
			_context.SaveChanges();
		}

		public void UpdateQuestion(Question question)
		{
			_context.Questions.Update(question);
			_context.SaveChanges();
		}
		public void DeleteQuestion(Question question)
		{
			_context.Questions.Remove(question);
			_context.SaveChanges();
		}
	}
}

