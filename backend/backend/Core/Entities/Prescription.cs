using System;

namespace backend.Core.Entities
{
    public class Prescription
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public DateTime DateIssued { get; set; }
        public string MedicationName { get; set; } = null!;
        public string Dosage { get; set; } = null!;
        public string Instructions { get; set; } = null!;

        public virtual Patient Patient { get; set; } = null!;
        public virtual Doctor Doctor { get; set; } = null!;

        public virtual MedicalRecord MedicalRecord { get; set; }
    }
}
