using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SusFoodBank.Models
{
    public class Analytics
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Time { get; set; } = DateTime.Now.ToString();

        public int LoginCount { get; set; } = 0;
        public int FailedLogin { get; set; } = 0;

        [ForeignKey("UserIdForeignKey")]
        public virtual ApplicationUser? ApplicationUser { get; set; }
    }
}
