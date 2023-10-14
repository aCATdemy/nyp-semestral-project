using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SusFoodBank.Models
{
    public class loginlist
    {
        public int Id { get; set; }
        public string Date { get; set; } = DateTime.Now.ToShortDateString().ToString();

        [ForeignKey("UserIdForeignKey")]
        public virtual ApplicationUser ApplicationUser { get; set; }
    }
}
