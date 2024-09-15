using System;
using System.Collections.Generic;

namespace backend.Core.Entities
{
    public class Doctor : MedicalStaff
    {
        public string Specialty { get; set; } = null!;
        public string Qualifications { get; set; } = null!;
        public bool IsAvailable { get; set; }
        public int? DepartmentId { get; set; }

        // Foreign key to ApplicationUser
        public string UserId { get; set; }

        // Navigation property to ApplicationUser
        public virtual ApplicationUser User { get; set; }

        public virtual Department Department { get; set; }
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
        public ICollection<DoctorRoom> DoctorRooms { get; set; } = new List<DoctorRoom>();

        public ICollection<MedicalRecord> MedicalRecords { get; set; } 
    }
}
