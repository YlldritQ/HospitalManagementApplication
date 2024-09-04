using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Core.Entities
{
    public class Patient
    {
        [Key]
        public int PatientId { get; set; }

        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required]
        public string Gender { get; set; } = string.Empty;

        public string ContactInfo { get; set; } = string.Empty;

        // Foreign key to ApplicationUser
        [Required]
        public string UserId { get; set; }

        // Navigation property to ApplicationUser
        public virtual ApplicationUser User { get; set; }

        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
        public ICollection<MedicalRecord> MedicalRecords { get; set; } = new List<MedicalRecord>();
    }
}
