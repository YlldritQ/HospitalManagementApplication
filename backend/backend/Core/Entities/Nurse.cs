using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Core.Entities
{
    public class Nurse : MedicalStaff
    {
        [Required]
        public string Qualifications { get; set; } = string.Empty;

        public bool IsAvailable { get; set; }

        public int? DepartmentId { get; set; }

        // Foreign key to ApplicationUser
        [Required]
        public string UserId { get; set; }

        // Navigation property to ApplicationUser
        public virtual ApplicationUser User { get; set; }

        public virtual Department Department { get; set; }
        public ICollection<NurseRoom> NurseRooms { get; set; } = new List<NurseRoom>();
    }
}
