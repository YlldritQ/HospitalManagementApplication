using backend.Core.Dtos.Patient;
using backend.Core.Entities;

namespace backend.Core.Dtos.Records
{
    public class MedicalRecordDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public DateTime RecordDate { get; set; }
        public string RecordDetails { get; set; }

        // Foreign keys
        public int? DoctorId { get; set; }
        public int? NurseId { get; set; }
        public int? PrescriptionId { get; set; }

    }
}
