using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SusFoodBank.Models{
    public class Item
    {
        public string? ImageFile { get; set; }
        
        public int Id { get; set; }

        [Required, MinLength(1), MaxLength(100)]
        public string? Name { get; set; } = string.Empty;

        [Required]
        public string? Description { get; set; } = string.Empty;

        public string? Contact { get; set; } = string.Empty;

        [RequiredAttribute]
        public string? Location { get; set; } = string.Empty;

        [DataType(DataType.Date)]
        public string? Expiry { get; set; } = string.Empty;

        public bool Halal { get; set; }

    }
}