using System;

namespace backend.Core.Entities
{
    public class MedicalRecord
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public DateTime RecordDate { get; set; }
        public string RecordDetails { get; set; } = null!;

        // Navigation property
        public virtual Patient Patient { get; set; } = null!;

        // Foreign key and navigation property for Doctor
        public int? DoctorId { get; set; }
        public virtual Doctor? Doctor { get; set; }

        // Foreign key and navigation property for Nurse
        public int? NurseId { get; set; }
        public virtual Nurse? Nurse { get; set; }

        // Foreign key and navigation property for Prescription
        public int? PrescriptionId { get; set; }
        public virtual Prescription? Prescription { get; set; }
    }
}
