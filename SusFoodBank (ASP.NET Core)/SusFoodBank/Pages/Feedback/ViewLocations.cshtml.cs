using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Org.BouncyCastle.Utilities;
using SusFoodBank.Models;
using SusFoodBank.Services;
using System.Data;

namespace SusFoodBank.Pages.Feedback
{
    [Authorize]
    [Authorize(Roles = "User")]
    public class ViewLocationsModel : PageModel
	{
		private readonly LocationService _locationService;

		public Locations Location { get; set; } = new();


		////Count how many
		//public int A()
		//{
		//    string stmt = "SELECT COUNT(*) FROM dbo.Locations";
		//    int count = 0;

		//    using (SqlConnection thisConnection = new SqlConnection("Data Source=(LocalDB)\\MSSQLLocalDB;Initial Catalog=SusFoodBankDB;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False"))
		//    {
		//        using (SqlCommand cmdCount = new SqlCommand(stmt, thisConnection))
		//        {
		//            thisConnection.Open();
		//            count = (int)cmdCount.ExecuteScalar();
		//        }
		//    }
		//    return count;
		//}

		public List<Locations> LocationList { get; set; } = new();
		public ViewLocationsModel(LocationService locationService)
		{
			_locationService = locationService;
		}

		public void OnGet()
		{

			LocationList = _locationService.GetAll();
		}
    }
}
