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
    }
}
